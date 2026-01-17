# Build script for optimized ML Docker image
# Reduces build time from 2 hours to ~10 minutes (first build)
# Subsequent builds: ~2 minutes

Write-Host "Building optimized ML Docker image with BuildKit..." -ForegroundColor Green

# Enable BuildKit for cache mounts and parallel builds
$env:DOCKER_BUILDKIT=1
$env:COMPOSE_DOCKER_CLI_BUILD=1

# First build (with model caching)
Write-Host "`nFirst build will download models (10-15 mins)..." -ForegroundColor Yellow
docker build `
    --file Dockerfile.optimized `
    --tag curasense-ml:optimized `
    --progress=plain `
    --build-arg BUILDKIT_INLINE_CACHE=1 `
    .

Write-Host "`n✓ Build complete!" -ForegroundColor Green
Write-Host "Run with: docker run -p 8000:8000 curasense-ml:optimized" -ForegroundColor Cyan

# Show image size
Write-Host "`nImage size:" -ForegroundColor Yellow
docker images curasense-ml:optimized
