# ============================================
# CURASENSE - OPTIMIZED BUILD SCRIPT
# Builds all services with BuildKit caching
# ============================================
# Usage: .\build-all.ps1 [-Service <name>] [-NoPrune] [-Push]
# ============================================

param(
    [string]$Service = "all",
    [switch]$NoPrune,
    [switch]$Push,
    [switch]$Parallel
)

$ErrorActionPreference = "Stop"

# Enable BuildKit for advanced caching
$env:DOCKER_BUILDKIT = 1
$env:COMPOSE_DOCKER_CLI_BUILD = 1

# Colors for output
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }

Write-Info "============================================"
Write-Info "CURASENSE OPTIMIZED BUILD"
Write-Info "BuildKit: Enabled"
Write-Info "============================================"

# Get start time
$startTime = Get-Date

# Build function
function Build-Service {
    param([string]$Name, [string]$Context, [string]$Tag)
    
    Write-Info "`n>> Building $Name..."
    $serviceStart = Get-Date
    
    docker build `
        --file "$Context/Dockerfile" `
        --tag $Tag `
        --build-arg BUILDKIT_INLINE_CACHE=1 `
        --progress=plain `
        $Context
    
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Failed to build $Name"
        return $false
    }
    
    $duration = (Get-Date) - $serviceStart
    Write-Success "✓ $Name built in $($duration.ToString('mm\:ss'))"
    
    # Show image size
    docker images $Tag --format "  Size: {{.Size}}"
    return $true
}

# Build services
$success = $true

switch ($Service.ToLower()) {
    "frontend" {
        $success = Build-Service -Name "Frontend" -Context "./curasense-frontend" -Tag "curasense/frontend:latest"
    }
    "ml" {
        $success = Build-Service -Name "ML Backend" -Context "./curasense-ml" -Tag "curasense/ml-api:latest"
    }
    "vision" {
        $success = Build-Service -Name "Vision Backend" -Context "./ml-fastapi" -Tag "curasense/vision-api:latest"
    }
    "all" {
        Write-Info "Building all services..."
        
        if ($Parallel) {
            Write-Info "Parallel build enabled..."
            # Build frontend separately (fastest)
            $job1 = Start-Job -ScriptBlock {
                $env:DOCKER_BUILDKIT = 1
                docker build --file "./curasense-frontend/Dockerfile" --tag "curasense/frontend:latest" ./curasense-frontend
            }
            
            # Build ML services sequentially (they share base layers)
            Build-Service -Name "ML Backend" -Context "./curasense-ml" -Tag "curasense/ml-api:latest"
            Build-Service -Name "Vision Backend" -Context "./ml-fastapi" -Tag "curasense/vision-api:latest"
            
            # Wait for frontend
            Wait-Job $job1
            Receive-Job $job1
        }
        else {
            # Sequential build (better cache utilization)
            $success = $success -and (Build-Service -Name "ML Backend" -Context "./curasense-ml" -Tag "curasense/ml-api:latest")
            $success = $success -and (Build-Service -Name "Vision Backend" -Context "./ml-fastapi" -Tag "curasense/vision-api:latest")
            $success = $success -and (Build-Service -Name "Frontend" -Context "./curasense-frontend" -Tag "curasense/frontend:latest")
        }
    }
    default {
        Write-Warning "Unknown service: $Service"
        Write-Info "Available services: frontend, ml, vision, all"
        exit 1
    }
}

# Calculate total time
$totalTime = (Get-Date) - $startTime

Write-Info "`n============================================"
Write-Info "BUILD SUMMARY"
Write-Info "============================================"

# Show all images
Write-Info "`nImage sizes:"
docker images "curasense/*" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedSince}}"

# Cleanup if requested
if (-not $NoPrune) {
    Write-Info "`nCleaning up dangling images..."
    docker image prune -f | Out-Null
}

# Push if requested
if ($Push -and $success) {
    Write-Info "`nPushing images to registry..."
    docker push curasense/frontend:latest
    docker push curasense/ml-api:latest
    docker push curasense/vision-api:latest
}

Write-Info "`n============================================"
if ($success) {
    Write-Success "✓ Build completed successfully!"
} else {
    Write-Warning "⚠ Build completed with errors"
}
Write-Info "Total time: $($totalTime.ToString('mm\:ss'))"
Write-Info "============================================"

# Next steps
Write-Info "`nNext steps:"
Write-Info "  Start services: docker compose up -d"
Write-Info "  View logs:      docker compose logs -f"
Write-Info "  Stop services:  docker compose down"
