import HeaderModule from "./modules/HeaderModule.js";
import CategoryPageModule from "./modules/CategoryPageModule.js";
import HeaderSearchModule from "./modules/HeaderSearchModule.js";
import SiteMenuModule from "./modules/SiteMenuModule.js";
import LetterSwapModule from "./modules/LetterSwapModule.js";
import HeroModule from "./modules/HeroModule.js";
import HeroRevealModule from "./modules/HeroRevealModule.js";
import CapabilitiesModule from "./modules/CapabilitiesModule.js";
import CountUpModule from "./modules/CountUpModule.js";
import NewsSliderModule from "./modules/NewsSliderModule.js";
import ExhibitionModule from "./modules/ExhibitionModule.js";
import RevealModule from "./modules/RevealModule.js";
import BackToTopModule from "./modules/BackToTopModule.js";
import StoryStripModule from "./modules/StoryStripModule.js";
import FitSliderModule from "./modules/FitSliderModule.js";
import InViewModule from "./modules/InViewModule.js";
import LoadMoreModule from "./modules/LoadMoreModule.js";
import LightboxModule from "./modules/LightboxModule.js";
import AwardsModule from "./modules/AwardsModule.js";
import CatalogModule from "./modules/CatalogModule.js";
import ProductDetailModule from "./modules/ProductDetailModule.js";
import RelatedSliderModule from "./modules/RelatedSliderModule.js";
import ContentTableModule from "./modules/ContentTableModule.js";
import PostModule from "./modules/PostModule.js";
import FormatsModule from "./modules/FormatsModule.js";
import MilestonePathModule from "./modules/MilestonePathModule.js";

const init = () => {
  [
    HeaderModule,
    CategoryPageModule,
    HeaderSearchModule,
    SiteMenuModule,
    LetterSwapModule,
    HeroModule,
    HeroRevealModule,
    CapabilitiesModule,
    CountUpModule,
    NewsSliderModule,
    ExhibitionModule,
    RevealModule,
    BackToTopModule,
    StoryStripModule,
    FitSliderModule,
    InViewModule,
    LoadMoreModule,
    LightboxModule,
    AwardsModule,
    CatalogModule,
    ProductDetailModule,
    RelatedSliderModule,
    ContentTableModule,
    PostModule,
    FormatsModule,
    MilestonePathModule,
  ].forEach((module) => {
    try {
      module();
    } catch (error) {
      console.error(`${module.name || "module"} failed to start`, error);
    }
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
