#!/bin/bash
# ============================================================
#  CuraSense — Azure Teardown Script
#  Deletes ALL Azure resources created by deploy-azure.sh
# ============================================================

set -euo pipefail

RESOURCE_GROUP="curasense-rg"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║  ⚠  WARNING: This will DELETE all CuraSense resources  ║${NC}"
echo -e "${RED}║     Resource Group: ${YELLOW}$RESOURCE_GROUP${RED}                      ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Show what will be deleted
echo -e "${YELLOW}Resources in $RESOURCE_GROUP:${NC}"
az resource list --resource-group "$RESOURCE_GROUP" --query "[].{Name:name, Type:type}" -o table 2>/dev/null || echo "  (could not list resources)"
echo ""

read -p "Type 'DELETE' to confirm deletion: " CONFIRM
if [ "$CONFIRM" != "DELETE" ]; then
    echo -e "${GREEN}Aborted. No resources were deleted.${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}Deleting resource group: $RESOURCE_GROUP ...${NC}"
az group delete \
    --name "$RESOURCE_GROUP" \
    --yes \
    --no-wait

echo -e "${GREEN}✓ Deletion initiated (running in background).${NC}"
echo -e "${GREEN}  It may take 2-5 minutes for all resources to be removed.${NC}"
echo -e "${GREEN}  Check status: az group show -n $RESOURCE_GROUP${NC}"

# Clean up local deploy info
if [ -f "$HOME/curasense-deployment-info.txt" ]; then
    rm "$HOME/curasense-deployment-info.txt"
    echo -e "${GREEN}✓ Removed ~/curasense-deployment-info.txt${NC}"
fi

# Clean up cloned repo
if [ -d "$HOME/curasense-deploy" ]; then
    rm -rf "$HOME/curasense-deploy"
    echo -e "${GREEN}✓ Removed ~/curasense-deploy${NC}"
fi
