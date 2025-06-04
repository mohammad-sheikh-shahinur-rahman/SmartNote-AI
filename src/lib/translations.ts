
export type Language = 'en' | 'bn';

export const translations = {
  en: {
    appTitle: 'SmartNote AI',
    newNote: 'New Note',
    toggleToBangla: 'BN',
    toggleToEnglish: 'EN',
    searchPlaceholder: "Search notes or tags...",
    viewGridView: "Grid view",
    viewListView: "List view",
    viewArchived: "View Archived",
    viewActive: "View Active",
    pinnedNotes: "Pinned Notes",
    otherNotes: "Other Notes",
    yourNotes: "Your Notes",
    archivedNotes: "Archived Notes",
    noActiveNotes: "No active notes found.",
    noActiveNotesDesc: "Try creating a new note or adjusting your search.",
    noArchivedNotes: "No archived notes found.",
    noArchivedNotesDesc: "Try adjusting your search or archiving some notes.",
    footerText: "SmartNote AI",
    aboutDeveloper: "About the Developer",
  },
  bn: {
    appTitle: 'স্মার্টনোট এআই',
    newNote: 'নতুন নোট',
    toggleToBangla: 'বাং',
    toggleToEnglish: 'EN',
    searchPlaceholder: "নোট বা ট্যাগ খুঁজুন...",
    viewGridView: "গ্রিড ভিউ",
    viewListView: "তালিকা ভিউ",
    viewArchived: "আর্কাইভ দেখুন",
    viewActive: "সক্রিয় দেখুন",
    pinnedNotes: "পিন করা নোট",
    otherNotes: "অন্যান্য নোট",
    yourNotes: "আপনার নোট",
    archivedNotes: "আর্কাইভ করা নোট",
    noActiveNotes: "কোনো সক্রিয় নোট পাওয়া যায়নি।",
    noActiveNotesDesc: "একটি নতুন নোট তৈরি করুন বা আপনার অনুসন্ধান সামঞ্জস্য করুন।",
    noArchivedNotes: "কোনো আর্কাইভ করা নোট পাওয়া যায়নি।",
    noArchivedNotesDesc: "আপনার অনুসন্ধান সামঞ্জস্য করুন বা কিছু নোট আর্কাইভ করুন।",
    footerText: "স্মার্টনোট এআই",
    aboutDeveloper: "ডেভেলপার পরিচিতি",
  },
};

export const getTranslations = (language: Language) => translations[language];
