import React, { useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { useTranslation, initReactI18next } from 'react-i18next';
import i18n from 'i18next';

// Fichiers de traduction
const resources = {
  en: {
    translation: {
      "welcome": "Welcome",
      // ajoutez d'autres traductions ici
    }
  },
  fr: {
    translation: {
      "welcome": "Bienvenue",
      // ajoutez d'autres traductions ici
    }
  }
};

// Configuration de i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // langue par défaut
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

// Images des drapeaux
const Usa = "path_to_your_image/usa.png";
const Fr = "path_to_your_image/fr.jpeg";

// Langues disponibles
const languages = [
  { name: "en", label: "En", image: Usa },
  { name: "fr", label: "Fr", image: Fr },
];

// Composant LanguageSwitcher
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [selected, setSelected] = useState(languages.find(lang => lang.name === i18n.language) || languages[0]);

  const handleChange = (language) => {
    setSelected(language);
    i18n.changeLanguage(language.name).then(() => {
      console.log("Language changed to:", language.name);
    }).catch((error) => {
      console.error("Error changing language:", error);
    });
  };

  return (
    <div className="p-4">
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative z-22">
          <Listbox.Button className="relative w-full flex items-center cursor-pointer space-x-6 rtl:space-x-reverse">
            <span className="inline-block md:h-6 md:w-6 w-4 h-4 rounded-full">
              <img src={selected.image} alt="" className="h-full w-full object-cover rounded-full" />
            </span>
            <span className="text-sm md:block hidden font-medium text-slate-600 dark:text-slate-300">
              {selected.label}
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute min-w-100 ltr:right-0 rtl:left-0 md:top-50 top-38 w-auto max-h-60 overflow-auto border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 mt-1">
              {languages.map((item, i) => (
                <Listbox.Option key={i} value={item} as={Fragment}>
                  {({ active }) => (
                    <li
                      className={`
                      w-full border-b border-b-gray-500 border-opacity-10 px-2 py-2 last:border-none last:mb-0 cursor-pointer first:rounded-t last:rounded-b
                        ${active ? "bg-slate-100 dark:bg-slate-700 dark:bg-opacity-70 bg-opacity-50 dark:text-white " : "text-slate-600 dark:text-slate-300"}
                        `}
                    >
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="flex-none">
                          <span className="lg:w-6 lg:h-6 w-4 h-4 rounded-full inline-block">
                            <img src={item.image} alt="" className="w-full h-full object-cover relative top-1 rounded-full" />
                          </span>
                        </span>
                        <span className="flex-1 lg:text-base text-sm capitalize">
                          {item.label}
                        </span>
                      </div>
                    </li>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

// Composant principal
const App = () => {
  const { t } = useTranslation();

  return (
    <div className="App">
      <h1>{t('welcome')}</h1>
      <LanguageSwitcher />
    </div>
  );
};

export default App;
