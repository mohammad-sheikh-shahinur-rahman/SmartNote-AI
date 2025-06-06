
export type Language = 'en' | 'bn';

export const translations = {
  en: {
    appTitle: 'SmartNote AI',
    languageName: 'English', // Added for explicit naming
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
    aboutDeveloper: "About the Developer", // Retained for potential direct link elsewhere if needed
    aboutAppFooterLink: "About SmartNote AI", // New key for footer
    developerPageLinkText: "Developer", // New key for AppHeader link
    developerPageLinkTooltip: "About the Developer", // New key for AppHeader link tooltip

    // Toast messages for HomePage
    noteUpdated: "Note Updated",
    noteCreated: "Note Created",
    noteSavedMessage: "\"{title}\" has been saved.",
    noteDeleted: "Note Deleted",
    noteDeletedMessage: "\"{title}\" has been deleted.",
    notePinned: "Note Pinned",
    noteUnpinned: "Note Unpinned",
    noteArchived: "Note Archived",
    noteUnarchived: "Note Unarchived",

    // AboutPage (now for Developer)
    aboutDeveloperPageTitleMeta: "About the Developer - SmartNote AI",
    aboutPageDescriptionMeta: "Information about SmartNote AI and its developer, Mohammad Sheikh Shahinur Rahman.", // This can remain generic or be specified
    aboutAppTitle: "About SmartNote AI", // This key is now used on the new /about-app page primarily
    aboutAppDescription: "SmartNote AI is an intelligent, user-friendly, and multilingual notebook application. It is built with Next.js, ShadCN UI, and Genkit AI. Key features include rich note editing, AI-powered auto-titles, summarization, and translation capabilities. SmartNote AI is designed to help you think faster, stay organized, and enhance your productivity.",
    shortIntroTitle: "Developer's Introduction",
    professionalIdentitiesTitle: "Professional Identity",
    learnMoreTitle: "Learn More",
    personalWebsiteButton: "Personal Website",
    blogButton: "Our Society Blog",
    goBackButton: "Go back to Homepage",
    footerCopyright: "SmartNote AI © {year}",

    // New About App Page
    aboutAppPageTitleMeta: "About SmartNote AI - SmartNote AI",


    // NoteCard
    pinnedBadge: "Pinned",
    lastUpdated: "Last updated {timeAgo}",
    editButton: "Edit",
    deleteButton: "Delete",
    unpinNoteTooltip: "Unpin note",
    pinNoteTooltip: "Pin note",
    unarchiveNoteTooltip: "Unarchive note",
    archiveNoteTooltip: "Archive note",
    moreTagsBadge: "+{count} more",

    // NoteEditor
    dialogTitleEdit: "Edit Note",
    dialogTitleCreate: "Create New Note",
    titleLabel: "Title",
    titlePlaceholder: "Note title",
    suggestTitleTooltip: "Suggest Title (requires content)",
    contentLabel: "Content",
    contentPlaceholder: "Write your note here... (Markdown supported)",
    boldTooltip: "Bold",
    italicTooltip: "Italic",
    codeTooltip: "Inline Code",
    strikethroughTooltip: "Strikethrough",
    ulTooltip: "Unordered List",
    olTooltip: "Ordered List",
    blockquoteTooltip: "Blockquote",
    hrTooltip: "Horizontal Rule",
    recordTooltipStart: "Start Recording",
    recordTooltipStop: "Stop Recording",
    microphonePermissionError: "Microphone permission denied. Please allow access in your browser settings.",
    microphoneAccessError: "Could not access microphone. Please ensure it's connected and enabled.",
    summarizeButton: "Summarize",
    aiAdvisorButton: "AI Advisor",
    selectLanguagePlaceholder: "Select language",
    translateButton: "Translate",
    aiSummaryLabel: "AI Generated Summary",
    insertSummaryButton: "Insert into Note",
    aiAdviceLabel: "AI Generated Advice",
    insertAdviceButton: "Insert into Note",
    tagsLabelEditor: "Tags",
    addTagPlaceholder: "Add a tag and press Enter",
    addTagButton: "Add Tag",
    suggestTagsTooltip: "Suggest Tags (requires content)",
    removeTagTooltip: "Remove tag {tag}",
    cancelButton: "Cancel",
    saveButton: "Save Note",
    untitledNote: "Untitled Note",

    // NoteEditor Toasts
    emptyNoteErrorTitle: "Empty Note",
    emptyNoteErrorDesc: "Cannot save an empty note. Please add a title, content, or tags.",
    suggestTitleErrorTitle: "Cannot Suggest Title",
    suggestTitleErrorDesc: "Please write some content before suggesting a title.",
    titleSuggestedToastTitle: "Title Suggested!",
    titleSuggestedToastDesc: "AI suggested: \"{title}\"",
    suggestTitleFailToastTitle: "Error",
    suggestTitleFailToastDesc: "Could not suggest a title. Please try again.",
    suggestTagsErrorTitle: "Cannot Suggest Tags",
    suggestTagsErrorDesc: "Please write some content before suggesting tags.",
    tagsSuggestedToastTitle: "Tags Suggested!",
    tagsSuggestedToastDesc: "AI suggested {count} new tag(s).",
    suggestTagsFailToastTitle: "Error",
    suggestTagsFailToastDesc: "Could not suggest tags. Please try again.",
    summarizeErrorTitle: "Cannot Summarize",
    summarizeErrorDesc: "Please write some content before summarizing.",
    summaryGeneratedToastTitle: "Summary Generated!",
    summaryGeneratedToastDesc: "AI has generated a summary for your note.",
    summarizeFailToastTitle: "Error Summarizing",
    summarizeFailToastDesc: "Could not generate a summary. Please try again.",
    summaryInsertedToastTitle: "Summary Inserted",
    summaryInsertedToastDesc: "The AI summary has been added to your note content.",
    getAdviceErrorTitle: "Cannot Get Advice",
    getAdviceErrorDesc: "Please write some content before getting AI advice.",
    adviceGeneratedToastTitle: "AI Advice Generated!",
    adviceGeneratedToastDesc: "AI has provided some advice for your note.",
    getAdviceFailToastTitle: "Error Getting Advice",
    getAdviceFailToastDesc: "Could not get AI advice. Please try again.",
    adviceInsertedToastTitle: "AI Advice Inserted",
    adviceInsertedToastDesc: "The AI advice has been added to your note content.",
    recordingStartedToastTitle: "Recording Started",
    recordingStartedToastDesc: "Microphone is now active.",
    transcribedToastTitle: "Text Transcribed!",
    transcribedToastDesc: "Audio has been transcribed and added to your note.",
    transcriptionErrorToastTitle: "Transcription Error",
    transcriptionErrorToastDesc: "Could not transcribe audio. Please try again.",
    microphoneErrorToastTitle: "Microphone Error",
    microphoneErrorToastDesc: "Could not access microphone.",
    translateErrorTitle: "Cannot Translate",
    translateErrorDesc: "Please write some content before translating.",
    translationDoneToastTitle: "Note Translated!",
    translationDoneToastDesc: "Content has been translated to {language}.",
    translateFailToastTitle: "Error Translating",
    translateFailToastDesc: "Could not translate the note. Please try again.",

    // ThemeSwitcher
    colorThemeLabel: "Color Theme",
    appearanceLabel: "Appearance",
    themeDefault: "Default",
    themeOceanic: "Oceanic",
    themeSunset: "Sunset",
    themeNostalgic: "Nostalgic",
    modeLight: "Light",
    modeDark: "Dark",

    // AI Chat Advisor on Home Page
    chatWithAdvisorTitle: "Chat with AI Advisor",
    chatInputPlaceholder: "Ask your AI Advisor, Boss...",
    sendButtonLabel: "Send message",
    aiWelcomeMessage: "Hello Boss! I am your AI Advisor, created by Mohammad Sheikh Shahinur Rahman. How can I assist you today?",
    chatError: "Sorry Boss, I'm having trouble connecting right now. Please try again later.",

    // Welcome Message on Home Page
    welcomeMessageTitle: "Welcome, Boss!",
    welcomeMessageTyping: "Take a moment to relax. I'm always ready to help you organize your creative ideas! Welcome to SmartNote AI, your intelligent notebook. Let's give your thoughts a new shape."
  },
  bn: {
    appTitle: 'স্মার্টনোট এআই',
    languageName: 'বাংলা', // Added for explicit naming
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
    noActiveNotesDesc: "একটি নতুন নোট তৈরি করুন অথবা আপনার অনুসন্ধান সামঞ্জস্য করুন।",
    noArchivedNotes: "কোনো আর্কাইভ করা নোট পাওয়া যায়নি।",
    noArchivedNotesDesc: "আপনার অনুসন্ধান সামঞ্জস্য করুন অথবা কিছু নোট আর্কাইভ করুন।",
    footerText: "স্মার্টনোট এআই",
    aboutDeveloper: "ডেভেলপার পরিচিতি", // Retained
    aboutAppFooterLink: "স্মার্টনোট এআই পরিচিতি", // New key for footer
    developerPageLinkText: "ডেভেলপার", // New key for AppHeader link
    developerPageLinkTooltip: "ডেভেলপার পরিচিতি", // New key for AppHeader link tooltip

    // Toast messages for HomePage
    noteUpdated: "নোট আপডেট করা হয়েছে",
    noteCreated: "নোট তৈরি করা হয়েছে",
    noteSavedMessage: "\"{title}\" সংরক্ষণ করা হয়েছে।",
    noteDeleted: "নোট মুছে ফেলা হয়েছে",
    noteDeletedMessage: "\"{title}\" মুছে ফেলা হয়েছে।",
    notePinned: "নোট পিন করা হয়েছে",
    noteUnpinned: "নোট আনপিন করা হয়েছে",
    noteArchived: "নোট আর্কাইভ করা হয়েছে",
    noteUnarchived: "নোট আনআর্কাইভ করা হয়েছে",

    // AboutPage (now for Developer)
    aboutDeveloperPageTitleMeta: "ডেভেলপার পরিচিতি - স্মার্টনোট এআই",
    aboutPageDescriptionMeta: "স্মার্টনোট এআই এবং এর ডেভেলপার মোহাম্মদ শেখ শাহিনুর রহমান সম্পর্কে তথ্য।", // Can remain
    aboutAppTitle: "স্মার্টনোট এআই পরিচিতি", // Used on new /about-app page
    aboutAppDescription: "স্মার্টনোট এআই একটি বুদ্ধিমান, ব্যবহারকারী-বান্ধব এবং বহুভাষিক নোটবুক অ্যাপ্লিকেশন। এটি নেক্সট.জেএস, শ্যাডসিএন ইউআই এবং জেনকিট এআই এর সমন্বয়ে তৈরি করা হয়েছে। এর প্রধান বৈশিষ্ট্যগুলির মধ্যে রয়েছে উন্নত নোট সম্পাদনা, এআই দ্বারা স্বয়ংক্রিয় শিরোনাম তৈরি, নোটের সারাংশ এবং বিভিন্ন ভাষায় অনুবাদ সুবিধা। স্মার্টনোট এআই আপনাকে দ্রুত চিন্তা করতে, সহজে আপনার কাজগুলো গুছিয়ে রাখতে এবং আপনার উৎপাদনশীলতা বৃদ্ধিতে সহায়তা করার জন্য ডিজাইন করা হয়েছে।",
    shortIntroTitle: "ডেভেলপারের পরিচিতি",
    professionalIdentitiesTitle: "পেশাগত পরিচয়",
    learnMoreTitle: "আরও জানুন",
    personalWebsiteButton: "ব্যক্তিগত ওয়েবসাইট",
    blogButton: "আমাদের সমাজ ব্লগ",
    goBackButton: "হোমপেজে ফিরে যান",
    footerCopyright: "স্মার্টনোট এআই © {year}",

    // New About App Page
    aboutAppPageTitleMeta: "অ্যাপ পরিচিতি - স্মার্টনোট এআই",


    // NoteCard
    pinnedBadge: "পিনড",
    lastUpdated: "সর্বশেষ আপডেট {timeAgo}",
    editButton: "সম্পাদনা",
    deleteButton: "মুছুন",
    unpinNoteTooltip: "নোট আনপিন করুন",
    pinNoteTooltip: "নোট পিন করুন",
    unarchiveNoteTooltip: "নোট আনআর্কাইভ করুন",
    archiveNoteTooltip: "নোট আর্কাইভ করুন",
    moreTagsBadge: "+{count} আরও",

    // NoteEditor
    dialogTitleEdit: "নোট সম্পাদনা করুন",
    dialogTitleCreate: "নতুন নোট তৈরি করুন",
    titleLabel: "শিরোনাম",
    titlePlaceholder: "নোটের শিরোনাম",
    suggestTitleTooltip: "শিরোনাম প্রস্তাব করুন (বিষয়বস্তু প্রয়োজন)",
    contentLabel: "বিষয়বস্তু",
    contentPlaceholder: "আপনার নোট এখানে লিখুন... (মার্কডাউন সমর্থিত)",
    boldTooltip: "বোল্ড",
    italicTooltip: "ইটালিক",
    codeTooltip: "ইনলাইন কোড",
    strikethroughTooltip: "স্ট্রাইকথ্রু",
    ulTooltip: "বুলেট তালিকা",
    olTooltip: "সংখ্যায়িত তালিকা",
    blockquoteTooltip: "ব্লককোট",
    hrTooltip: "অনুভূমিক রেখা",
    recordTooltipStart: "রেকর্ডিং শুরু করুন",
    recordTooltipStop: "রেকর্ডিং বন্ধ করুন",
    microphonePermissionError: "মাইক্রোফোনের অনুমতি দেওয়া হয়নি। অনুগ্রহ করে আপনার ব্রাউজার সেটিংসে অনুমতি দিন।",
    microphoneAccessError: "মাইক্রোফোন অ্যাক্সেস করা যায়নি। অনুগ্রহ করে নিশ্চিত করুন এটি সংযুক্ত এবং সক্রিয় আছে।",
    summarizeButton: "সারাংশ করুন",
    aiAdvisorButton: "এআই উপদেষ্টা",
    selectLanguagePlaceholder: "ভাষা নির্বাচন করুন",
    translateButton: "অনুবাদ করুন",
    aiSummaryLabel: "এআই দ্বারা তৈরি সারাংশ",
    insertSummaryButton: "নোটে যোগ করুন",
    aiAdviceLabel: "এআই দ্বারা তৈরি পরামর্শ",
    insertAdviceButton: "নোটে যোগ করুন",
    tagsLabelEditor: "ট্যাগ",
    addTagPlaceholder: "একটি ট্যাগ যোগ করে এন্টার চাপুন",
    addTagButton: "ট্যাগ যোগ করুন",
    suggestTagsTooltip: "ট্যাগ প্রস্তাব করুন (বিষয়বস্তু প্রয়োজন)",
    removeTagTooltip: "{tag} ট্যাগটি সরান",
    cancelButton: " বাতিল করুন",
    saveButton: "নোট সংরক্ষণ করুন",
    untitledNote: "শিরোনামহীন নোট",

    // NoteEditor Toasts
    emptyNoteErrorTitle: "খালি নোট",
    emptyNoteErrorDesc: "খালি নোট সংরক্ষণ করা যাবে না। অনুগ্রহ করে একটি শিরোনাম, বিষয়বস্তু বা ট্যাগ যোগ করুন।",
    suggestTitleErrorTitle: "শিরোনাম প্রস্তাব করা যাচ্ছে না",
    suggestTitleErrorDesc: "শিরোনাম প্রস্তাব করার আগে অনুগ্রহ করে কিছু বিষয়বস্তু লিখুন।",
    titleSuggestedToastTitle: "শিরোনাম প্রস্তাবিত!",
    titleSuggestedToastDesc: "এআই প্রস্তাব করেছে: \"{title}\"",
    suggestTitleFailToastTitle: "ত্রুটি",
    suggestTitleFailToastDesc: "শিরোনাম প্রস্তাব করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
    suggestTagsErrorTitle: "ট্যাগ প্রস্তাব করা যাচ্ছে না",
    suggestTagsErrorDesc: "ট্যাগ প্রস্তাব করার আগে অনুগ্রহ করে কিছু বিষয়বস্তু লিখুন।",
    tagsSuggestedToastTitle: "ট্যাগ প্রস্তাবিত!",
    tagsSuggestedToastDesc: "এআই {count}টি নতুন ট্যাগ প্রস্তাব করেছে।",
    suggestTagsFailToastTitle: "ত্রুটি",
    suggestTagsFailToastDesc: "ট্যাগ প্রস্তাব করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
    summarizeErrorTitle: "সারাংশ করা যাচ্ছে না",
    summarizeErrorDesc: "সারাংশ করার আগে অনুগ্রহ করে কিছু বিষয়বস্তু লিখুন।",
    summaryGeneratedToastTitle: "সারাংশ তৈরি!",
    summaryGeneratedToastDesc: "এআই আপনার নোটের জন্য একটি সারাংশ তৈরি করেছে।",
    summarizeFailToastTitle: "সারাংশ তৈরিতে ত্রুটি",
    summarizeFailToastDesc: "সারাংশ তৈরি করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
    summaryInsertedToastTitle: "সারাংশ যোগ করা হয়েছে",
    summaryInsertedToastDesc: "এআই সারাংশ আপনার নোটের বিষয়বস্তুতে যোগ করা হয়েছে।",
    getAdviceErrorTitle: "পরামর্শ পাওয়া যাচ্ছে না",
    getAdviceErrorDesc: "এআই পরামর্শ পাওয়ার আগে অনুগ্রহ করে কিছু বিষয়বস্তু লিখুন।",
    adviceGeneratedToastTitle: "এআই পরামর্শ তৈরি!",
    adviceGeneratedToastDesc: "এআই আপনার নোটের জন্য কিছু পরামর্শ দিয়েছে।",
    getAdviceFailToastTitle: "পরামর্শ পেতে ত্রুটি",
    getAdviceFailToastDesc: "এআই পরামর্শ পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
    adviceInsertedToastTitle: "এআই পরামর্শ যোগ করা হয়েছে",
    adviceInsertedToastDesc: "এআই পরামর্শ আপনার নোটের বিষয়বস্তুতে যোগ করা হয়েছে।",
    recordingStartedToastTitle: "রেকর্ডিং শুরু হয়েছে",
    recordingStartedToastDesc: "মাইক্রোফোন এখন সক্রিয়।",
    transcribedToastTitle: "পাঠ্য প্রতিলিপি করা হয়েছে!",
    transcribedToastDesc: "অডিও প্রতিলিপি করে আপনার নোটে যোগ করা হয়েছে।",
    transcriptionErrorToastTitle: "প্রতিলিপি করণে ত্রুটি",
    transcriptionErrorToastDesc: "অডিও প্রতিলিপি করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
    microphoneErrorToastTitle: "মাইক্রোফোন ত্রুটি",
    microphoneErrorToastDesc: "মাইক্রোফোন অ্যাক্সেস করা যায়নি।",
    translateErrorTitle: "অনুবাদ করা যাচ্ছে না",
    translateErrorDesc: "অনুবাদ করার আগে অনুগ্রহ করে কিছু বিষয়বস্তু লিখুন।",
    translationDoneToastTitle: "নোট অনুবাদিত!",
    translationDoneToastDesc: "বিষয়বস্তু {language} এ অনুবাদ করা হয়েছে।",
    translateFailToastTitle: "অনুবাদে ত্রুটি",
    translateFailToastDesc: "নোট অনুবাদ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",

    // ThemeSwitcher
    colorThemeLabel: "রঙ থিম",
    appearanceLabel: "ধরন",
    themeDefault: "ডিফল্ট",
    themeOceanic: "ওশেনিক",
    themeSunset: "সানসেট",
    themeNostalgic: "নস্টালজিক",
    modeLight: "লাইট",
    modeDark: "ডার্ক",

    // AI Chat Advisor on Home Page
    chatWithAdvisorTitle: "এআই উপদেষ্টার সাথে চ্যাট করুন",
    chatInputPlaceholder: "আপনার এআই উপদেষ্টাকে জিজ্ঞাসা করুন, বস...",
    sendButtonLabel: "বার্তা পাঠান",
    aiWelcomeMessage: "হ্যালো বস! আমি আপনার এআই উপদেষ্টা, আমাকে তৈরি করেছেন মোহাম্মদ শেখ শাহিনুর রহমান। আজ আমি আপনাকে কীভাবে সহায়তা করতে পারি?",
    chatError: "দুঃখিত বস, এই মুহূর্তে সংযোগ করতে সমস্যা হচ্ছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।",

    // Welcome Message on Home Page
    welcomeMessageTitle: "স্বাগতম, বস!",
    welcomeMessageTyping: "কাজের ফাঁকে একটু বিশ্রাম নিন। আপনার সৃজনশীল ধারণাগুলো সাজিয়ে গুছিয়ে রাখতে আমি সর্বদা প্রস্তুত! আপনার স্মার্ট নোটবুক, SmartNote AI-তে আপনাকে স্বাগতম। আসুন, আপনার চিন্তাভাবনাগুলোকে নতুন রূপ দেই।"
  },
};

export const getTranslations = (language: Language) => translations[language];
