import jaDictionary from "./loc-ja.js?v=20260910-2";
import zhDictionary from "./loc-zh.js?v=20260910-2";

export const SUPPORTED_LANGUAGES = Object.freeze([
  { id: "en", label: "English" },
  { id: "ja", label: "日本語" },
  { id: "zh", label: "简体中文" }
]);

export const DEFAULT_LANGUAGE = "en";
export const LANGUAGE_STORAGE_KEY = "anime-hair-studio-language";

const LANGUAGE_DICTIONARIES = Object.freeze({ ja: jaDictionary, zh: zhDictionary });
export function normalizeLanguage(value) {
  return SUPPORTED_LANGUAGES.some((language) => language.id === value) ? value : DEFAULT_LANGUAGE;
}


export function translateUiString(value, language = DEFAULT_LANGUAGE) {
  const dictionary = LANGUAGE_DICTIONARIES[language];
  if (!dictionary || typeof value !== "string") return value;
  const leading = value.match(/^\s*/)?.[0] || "";
  const trailing = value.match(/\s*$/)?.[0] || "";
  const text = value.trim();
  if (!text) return value;
  if (dictionary[text]) return `${leading}${dictionary[text]}${trailing}`;

  const strandCount = text.match(/^(\d+) strands?$/);
  if (strandCount) {
    if (language === "ja") return `${leading}${strandCount[1]} ストランド${trailing}`;
    if (language === "zh") return `${leading}${strandCount[1]} strands${trailing}`;
  }
  const mirrorInstanceCount = text.match(/^Decouple (\d+) Mirror Instances$/);
  if (mirrorInstanceCount) {
    if (language === "ja") return `${leading}${mirrorInstanceCount[1]} 件のミラーインスタンスのリンクを解除${trailing}`;
    if (language === "zh") return `${leading}解绑 ${mirrorInstanceCount[1]} 个镜像实例${trailing}`;
  }
  const vertexStats = text.match(/^(.+) verts \/ (.+) tris$/);
  if (vertexStats) {
    if (language === "ja") return `${leading}${vertexStats[1]} 頂点 / ${vertexStats[2]} 三角形${trailing}`;
    if (language === "zh") return `${leading}${vertexStats[1]} verts / ${vertexStats[2]} tris${trailing}`;
  }
  const collapseLabel = text.match(/^Collapse (.+)$/);
  if (collapseLabel) {
    const translatedLabel = translateUiString(collapseLabel[1], language);
    if (translatedLabel !== collapseLabel[1]) {
      if (language === "ja") return `${leading}${translatedLabel}を折りたたむ${trailing}`;
      if (language === "zh") return `${leading}折叠 ${translatedLabel}${trailing}`;
    }
  }
  return value;
}

export function createDocumentLocalizer(root, initialLanguage = DEFAULT_LANGUAGE) {
  let language = normalizeLanguage(initialLanguage);
  let changingLanguage = false;
  const textSources = new WeakMap();
  const attributeSources = new WeakMap();
  const localizedAttributes = ["title", "aria-label", "placeholder"];

  function localizeTextNode(node) {
    const current = node.nodeValue;
    let source = textSources.get(node);
    if (source === undefined) {
      source = current;
      textSources.set(node, source);
    } else if (!changingLanguage) {
      const expected = translateUiString(source, language);
      if (current !== source && current !== expected) {
        source = current;
        textSources.set(node, source);
      }
    }
    const translated = translateUiString(source, language);
    if (node.nodeValue !== translated) node.nodeValue = translated;
  }

  function localizeElement(element) {
    if (element.matches?.("script, style")) return;
    let sources = attributeSources.get(element);
    if (!sources) {
      sources = {};
      attributeSources.set(element, sources);
    }
    localizedAttributes.forEach((attribute) => {
      if (!element.hasAttribute?.(attribute)) return;
      const current = element.getAttribute(attribute);
      const previous = sources[attribute];
      if (previous === undefined || (!changingLanguage && current !== previous && current !== translateUiString(previous, language))) {
        sources[attribute] = current;
      }
      const translated = translateUiString(sources[attribute], language);
      if (current !== translated) element.setAttribute(attribute, translated);
    });
  }

  function localizeSubtree(node) {
    if (node.nodeType === 3) {
      localizeTextNode(node);
      return;
    }
    if (node.nodeType !== 1 && node.nodeType !== 9 && node.nodeType !== 11) return;
    if (node.nodeType === 1) localizeElement(node);
    const walker = root.createTreeWalker(node, 0x5);
    let current = walker.nextNode();
    while (current) {
      if (current.nodeType === 3) localizeTextNode(current);
      else localizeElement(current);
      current = walker.nextNode();
    }
  }

  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === "attributes") localizeElement(record.target);
      else if (record.type === "characterData") localizeTextNode(record.target);
      else record.addedNodes.forEach(localizeSubtree);
    });
  });

  function setLanguage(nextLanguage) {
    language = normalizeLanguage(nextLanguage);
    root.documentElement.lang = language;
    changingLanguage = true;
    try {
      localizeSubtree(root.documentElement);
    } finally {
      changingLanguage = false;
    }
    return language;
  }

  setLanguage(language);
  observer.observe(root.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: localizedAttributes
  });

  return {
    get language() {
      return language;
    },
    setLanguage,
    disconnect: () => observer.disconnect()
  };
}

