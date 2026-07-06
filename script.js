if (window.lucide) lucide.createIcons();

const brandLogo = document.getElementById("brandLogo");
const brandLogoPlate = document.getElementById("brandLogoPlate");
const brandFallback = document.getElementById("brandFallback");

function showBrandFallback() {
    brandLogoPlate.hidden = true;
    brandFallback.hidden = false;
}

brandLogo.addEventListener("error", showBrandFallback);
if (brandLogo.complete && brandLogo.naturalWidth === 0) showBrandFallback();
