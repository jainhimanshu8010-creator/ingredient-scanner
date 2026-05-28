import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // App
    'app.title': 'Scan To Decode',
    'app.subtitle': 'Discover product ingredients & health insights',

    // Login
    'login.title': 'Welcome to Scan To Decode',
    'login.subtitle': 'Scan any product barcode to discover ingredients and health information',
    'login.name': 'Your Name',
    'login.namePlaceholder': 'Enter your name',
    'login.age': 'Your Age',
    'login.agePlaceholder': 'Enter your age',
    'login.city': 'Your City',
    'login.cityPlaceholder': 'Enter your city',
    'login.category': 'Select Your Category',
    'login.category.dietician': 'Dietician',
    'login.category.gym_freak': 'Fitness Enthusiast',
    'login.category.adult': 'Adult',
    'login.category.student': 'Student',
    'login.start': 'Start Scanning',

    // Scanner
    'scanner.title': 'Scan To Decode',
    'scanner.subtitle': 'Point your camera at a barcode',
    'scanner.openCamera': 'Open Camera',
    'scanner.orManual': 'Or enter manually',
    'scanner.placeholder': 'Enter barcode number',
    'scanner.decodeProduct': 'Decode Product',
    'scanner.scanning': 'Hold steady - scanning for barcode...',
    'scanner.closeCamera': 'Close Camera',
    'scanner.cameraError': 'Camera Error',

    // Product Details
    'details.title': 'Product Details',
    'details.subtitle': 'Complete ingredient breakdown',
    'details.measurementNote': 'Measurement Note',
    'details.measurementDesc': 'Ingredient quantities measured in teaspoons - Standard conversion: 1 tsp = 5ml',
    'details.barcode': 'Barcode',
    'details.price': 'Price',
    'details.scanAnother': 'Scan Another Product',
    'details.ingredients': 'Ingredients',
    'details.totalVolume': 'Total Volume',
    'details.teaspoons': 'teaspoons',
    'details.noIngredients': 'No ingredients information available for this product',

    // Health Meter
    'health.overall': 'Overall Health Rating',
    'health.excellent': 'Excellent',
    'health.good': 'Good',
    'health.fair': 'Fair',
    'health.poor': 'Poor',
    'health.score': 'Score for',
    'health.caffeine': 'Caffeine',
    'health.sugar': 'Sugar',
    'health.category': 'Category',
    'health.benefits': 'Age-Specific Benefits',
    'health.recommendations': 'Recommendations for',
    'health.alert': 'Health Alert',
    'health.alertDesc': 'This product may not be suitable due to high content. Consider healthier alternatives or consult a healthcare provider.',
    'health.disclaimer': 'This health assessment is based on product composition and general age-group health guidelines. Individual health needs may vary. Consult healthcare professionals for personalized advice.',

    // Healthy Alternatives
    'alternatives.title': 'Healthier Alternatives',
    'alternatives.subtitle': 'Organic and natural products for better health',
    'alternatives.unhealthyAlert': 'This product has a low health score. We recommend healthier alternatives below.',
    'alternatives.poorAlert': 'This product has a moderate health score. Consider these healthier options to improve your diet.',
    'alternatives.boost': 'boost',
    'alternatives.improvement': 'Switching to these alternatives can improve your health by',
    'alternatives.sugar': 'Sugar',
    'alternatives.caffeine': 'Caffeine',

    // Age Groups
    'age.child': 'child',
    'age.student': 'student',
    'age.adult': 'adult',
    'age.senior': 'senior',
    'age.children': 'children',
    'age.students': 'students',
    'age.adults': 'adults',
    'age.seniors': 'seniors',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.searching': 'Searching...',
    'common.notFound': 'Product not found',
    'common.tryManual': 'Try entering the barcode manually',
  },

  hi: {
    // App
    'app.title': 'स्कैन टू डिकोड',
    'app.subtitle': 'उत्पाद की सामग्री और स्वास्थ्य जानकारी देखें',

    // Login
    'login.title': 'स्कैन टू डिकोड में आपका स्वागत है',
    'login.subtitle': 'किसी भी उत्पाद का बारकोड स्कैन करें और सामग्री तथा स्वास्थ्य जानकारी प्राप्त करें',
    'login.name': 'आपका नाम',
    'login.namePlaceholder': 'अपना नाम दर्ज करें',
    'login.age': 'आपकी आयु',
    'login.agePlaceholder': 'अपनी आयु दर्ज करें',
    'login.city': 'आपका शहर',
    'login.cityPlaceholder': 'अपना शहर दर्ज करें',
    'login.category': 'अपनी श्रेणी चुनें',
    'login.category.dietician': 'आहार विशेषज्ञ',
    'login.category.gym_freak': 'फिटनेस प्रेमी',
    'login.category.adult': 'वयस्क',
    'login.category.student': 'छात्र',
    'login.start': 'स्कैनिंग शुरू करें',

    // Scanner
    'scanner.title': 'स्कैन टू डिकोड',
    'scanner.subtitle': 'बारकोड पर कैमरा लगाएं',
    'scanner.openCamera': 'कैमरा खोलें',
    'scanner.orManual': 'या मैन्युअल रूप से दर्ज करें',
    'scanner.placeholder': 'बारकोड नंबर दर्ज करें',
    'scanner.decodeProduct': 'उत्पाद डिकोड करें',
    'scanner.scanning': 'स्थिर रखें - बारकोड स्कैन हो रहा है...',
    'scanner.closeCamera': 'कैमरा बंद करें',
    'scanner.cameraError': 'कैमरा त्रुटि',

    // Product Details
    'details.title': 'उत्पाद विवरण',
    'details.subtitle': 'संपूर्ण सामग्री विवरण',
    'details.measurementNote': 'माप नोट',
    'details.measurementDesc': 'सामग्री मात्रा चम्मच में मापी गई - मानक रूपांतरण: 1 छोटी चम्मच = 5ml',
    'details.barcode': 'बारकोड',
    'details.price': 'कीमत',
    'details.scanAnother': 'अन्य उत्पाद स्कैन करें',
    'details.ingredients': 'सामग्री',
    'details.totalVolume': 'कुल मात्रा',
    'details.teaspoons': 'छोटी चम्मच',
    'details.noIngredients': 'इस उत्पाद के लिए कोई सामग्री जानकारी उपलब्ध नहीं है',

    // Health Meter
    'health.overall': 'समग्र स्वास्थ्य रेटिंग',
    'health.excellent': 'उत्कृष्ट',
    'health.good': 'अच्छा',
    'health.fair': 'औसत',
    'health.poor': 'खराब',
    'health.score': 'के लिए स्कोर',
    'health.caffeine': 'कैफीन',
    'health.sugar': 'चीनी',
    'health.category': 'श्रेणी',
    'health.benefits': 'आयु-विशिष्ट लाभ',
    'health.recommendations': 'के लिए सिफारिशें',
    'health.alert': 'स्वास्थ्य अलर्ट',
    'health.alertDesc': 'उच्च सामग्री के कारण यह उत्पाद उपयुक्त नहीं हो सकता है। स्वस्थ विकल्पों पर विचार करें या स्वास्थ्य सेवा प्रदाता से परामर्श करें।',
    'health.disclaimer': 'यह स्वास्थ्य मूल्यांकन उत्पाद संरचना और सामान्य आयु-समूह स्वास्थ्य दिशानिर्देशों पर आधारित है। व्यक्तिगत स्वास्थ्य आवश्यकताएं भिन्न हो सकती हैं। व्यक्तिगत सलाह के लिए स्वास्थ्य पेशेवरों से परामर्श करें।',

    // Healthy Alternatives
    'alternatives.title': 'स्वस्थ विकल्प',
    'alternatives.subtitle': 'बेहतर स्वास्थ्य के लिए जैविक और प्राकृतिक उत्पाद',
    'alternatives.unhealthyAlert': 'इस उत्पाद का स्वास्थ्य स्कोर कम है। हम नीचे दिए गए स्वस्थ विकल्पों की सलाह देते हैं।',
    'alternatives.poorAlert': 'इस उत्पाद का स्वास्थ्य स्कोर मध्यम है। अपने आहार में सुधार के लिए इन स्वस्थ विकल्पों पर विचार करें।',
    'alternatives.boost': 'वृद्धि',
    'alternatives.improvement': 'इन विकल्पों पर स्विच करने से आपके स्वास्थ्य में सुधार हो सकता है',
    'alternatives.sugar': 'चीनी',
    'alternatives.caffeine': 'कैफीन',

    // Age Groups
    'age.child': 'बच्चे',
    'age.student': 'छात्र',
    'age.adult': 'वयस्क',
    'age.senior': 'वरिष्ठ',
    'age.children': 'बच्चों',
    'age.students': 'छात्रों',
    'age.adults': 'वयस्कों',
    'age.seniors': 'वरिष्ठों',

    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफल',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.searching': 'खोज रहा है...',
    'common.notFound': 'उत्पाद नहीं मिला',
    'common.tryManual': 'बारकोड मैन्युअल रूप से दर्ज करने का प्रयास करें',
  },

  ta: {
    // App
    'app.title': 'ஸ்கேன் டூ டிகோட்',
    'app.subtitle': 'தயாரிப்பு பொருட்கள் மற்றும் சுகாதார தகவல்களைக் கண்டறியுங்கள்',

    // Login
    'login.title': 'ஸ்கேன் டூ டிகோட்-க்கு வரவேற்பு',
    'login.subtitle': 'எந்தத் தயாரிப்பின் பார்கோடையும் ஸ்கேன் செய்து பொருட்கள் மற்றும் சுகாதார தகவல்களைக் கண்டறியுங்கள்',
    'login.name': 'உங்கள் பெயர்',
    'login.namePlaceholder': 'உங்கள் பெயரை உள்ளிடவும்',
    'login.age': 'உங்கள் வயது',
    'login.agePlaceholder': 'உங்கள் வயதை உள்ளிடவும்',
    'login.city': 'உங்கள் நகரம்',
    'login.cityPlaceholder': 'உங்கள் நகரத்தை உள்ளிடவும்',
    'login.category': 'உங்கள் வகையைத் தேர்ந்தெடுக்கவும்',
    'login.category.dietician': 'ஊட்டச்சத்து நிபுணர்',
    'login.category.gym_freak': 'உடற்பயிற்சி ஆர்வலர்',
    'login.category.adult': 'பெரியவர்',
    'login.category.student': 'மாணவர்',
    'login.start': 'ஸ்கேன் செய்யத் தொடங்கு',

    // Scanner
    'scanner.title': 'ஸ்கேன் டூ டிகோட்',
    'scanner.subtitle': 'பார்கோடில் உங்கள் கேமராவை சுட்டிக்காட்டவும்',
    'scanner.openCamera': 'கேமராவைத் திற',
    'scanner.orManual': 'அல்லது கைமுறையாக உள்ளிடவும்',
    'scanner.placeholder': 'பார்கோட் எண்ணை உள்ளிடவும்',
    'scanner.decodeProduct': 'தயாரிப்பை டிகோட் செய்',
    'scanner.scanning': 'நிலையாக வைக்கவும் - பார்கோட் ஸ்கேன் செய்கிறது...',
    'scanner.closeCamera': 'கேமராவை மூடு',
    'scanner.cameraError': 'கேமரா பிழை',

    // Product Details
    'details.title': 'தயாரிப்பு விவரங்கள்',
    'details.subtitle': 'முழு பொருட்கள் விவரம்',
    'details.measurementNote': 'அளவீட்டு குறிப்பு',
    'details.measurementDesc': 'பொருட்கள் அளவு தேக்காயில் அளவிடப்பட்டது - நிலையான மாற்றம்: 1 தேக்காய் = 5ml',
    'details.barcode': 'பார்கோடு',
    'details.price': 'விலை',
    'details.scanAnother': 'மற்றொரு தயாரிப்பை ஸ்கேன் செய்',
    'details.ingredients': 'பொருட்கள்',
    'details.totalVolume': 'மொத்த அளவு',
    'details.teaspoons': 'தேக்காய்கள்',
    'details.noIngredients': 'இந்த தயாரிப்பிற்கு பொருட்கள் தகவல் இல்லை',

    // Health Meter
    'health.overall': 'மொத்த சுகாதார மதிப்பீடு',
    'health.excellent': 'சிறந்த',
    'health.good': 'நல்லது',
    'health.fair': 'சராசரி',
    'health.poor': 'மோசம்',
    'health.score': 'இவர்களுக்கான மதிப்பீடு',
    'health.caffeine': 'காபின்',
    'health.sugar': 'சர்க்கரை',
    'health.category': 'வகை',
    'health.benefits': 'வயது-குறிப்பிட்ட நன்மைகள்',
    'health.recommendations': 'இவர்களுக்கான பரிந்துரைகள்',
    'health.alert': 'சுகாதார எச்சரிக்கை',
    'health.alertDesc': 'அதிக உள்ளடக்கம் காரணமாக இந்த தயாரிப்பு பொருத்தமாக இல்லாமல் இருக்கலாம். ஆரோக்கியமான மாற்றங்களை கருத்தில் கொள்ளவும்.',
    'health.disclaimer': 'இந்த சுகாதார மதிப்பீடு தயாரிப்பு கலவை மற்றும் பொதுவான வயது-குழு சுகாதார வழிகாட்டுதல்களின் அடிப்படையில் உள்ளது.',

    // Healthy Alternatives
    'alternatives.title': 'ஆரோக்கியமான மாற்றங்கள்',
    'alternatives.subtitle': 'சிறந்த சுகாதாரத்திற்கான இயற்கை மற்றும் இயற்கை தயாரிப்புகள்',
    'alternatives.unhealthyAlert': 'இந்த தயாரிப்பின் சுகாதார மதிப்பீடு குறைவாக உள்ளது. கீழே உள்ள ஆரோக்கியமான மாற்றங்களை பரிந்துரைக்கிறோம்.',
    'alternatives.poorAlert': 'இந்த தயாரிப்பின் சுகாதார மதிப்பீடு மிதமானது. உங்கள் உணவை மேம்படுத்த இந்த ஆரோக்கியமான விருப்பங்களைக் கருத்தில் கொள்ளுங்கள்.',
    'alternatives.boost': 'அதிகரிப்பு',
    'alternatives.improvement': 'இந்த மாற்றங்களுக்கு மாறுவதால் உங்கள் ஆரோக்கியத்தை மேம்படுத்தலாம்',
    'alternatives.sugar': 'சர்க்கரை',
    'alternatives.caffeine': 'காபின்',

    // Age Groups
    'age.child': 'குழந்தை',
    'age.student': 'மாணவர்',
    'age.adult': 'பெரியவர்',
    'age.senior': 'மூத்தவர்',
    'age.children': 'குழந்தைகள்',
    'age.students': 'மாணவர்கள்',
    'age.adults': 'பெரியவர்கள்',
    'age.seniors': 'மூத்தவர்கள்',

    // Common
    'common.loading': 'ஏற்றுகிறது...',
    'common.error': 'பிழை',
    'common.success': 'வெற்றி',
    'common.cancel': 'ரத்துசெய்',
    'common.save': 'சேமி',
    'common.searching': 'தேடுகிறது...',
    'common.notFound': 'தயாரிப்பு கிடைக்கவில்லை',
    'common.tryManual': 'பார்கோடை கைமுறையாக உள்ளிட முயற்சிக்கவும்',
  },

  te: {
    // App
    'app.title': 'స్కాన్ టూ డీకోడ్',
    'app.subtitle': 'ఉత్పత్తి పదార్థాలు మరియు ఆరోగ్య సమాచారాన్ని కనుగొనండి',

    // Login
    'login.title': 'స్కాన్ టూ డీకోడ్‌కు స్వాగతం',
    'login.subtitle': 'ఏదైనా ఉత్పత్తి బార్కోడ్‌ను స్కాన్ చేసి పదార్థాలు మరియు ఆరోగ్య సమాచారాన్ని పొందండి',
    'login.name': 'మీ పేరు',
    'login.namePlaceholder': 'మీ పేరును నమోదు చేయండి',
    'login.age': 'మీ వయస్సు',
    'login.agePlaceholder': 'మీ వయస్సు నమోదు చేయండి',
    'login.city': 'మీ నగరం',
    'login.cityPlaceholder': 'మీ నగరాన్ని నమోదు చేయండి',
    'login.category': 'మీ వర్గాన్ని ఎంచుకోండి',
    'login.category.dietician': 'పోషకాహార నిపుణుడు',
    'login.category.gym_freak': 'ఫిట్‌నెస్ ఔత్సాహికుడు',
    'login.category.adult': 'పెద్దవాడు',
    'login.category.student': 'విద్యార్థి',
    'login.start': 'స్కానింగ్ ప్రారంభించండి',

    // Scanner
    'scanner.title': 'స్కాన్ టూ డీకోడ్',
    'scanner.subtitle': 'బార్కోడ్ వైపు మీ కెమేరాను చూపండి',
    'scanner.openCamera': 'కెమేరా తెరవండి',
    'scanner.orManual': 'లేదా మాన్యువల్‌గా నమోదు చేయండి',
    'scanner.placeholder': 'బార్కోడ్ నంబర్ నమోదు చేయండి',
    'scanner.decodeProduct': 'ఉత్పత్తిని డీకోడ్ చేయండి',
    'scanner.scanning': 'స్థిరంగా ఉంచండి - బార్కోడ్ స్కాన్ అవుతోంది...',
    'scanner.closeCamera': 'కెమేరా మూసివేయండి',
    'scanner.cameraError': 'కెమేరా లోపం',

    // Product Details
    'details.title': 'ఉత్పత్తి వివరాలు',
    'details.subtitle': 'పూర్తి పదార్థాల వివరాలు',
    'details.measurementNote': 'కొలత గమనిక',
    'details.measurementDesc': 'పదార్థాల పరిమాణం టీస్పూన్లలో కొలుస్తారు - ప్రామాణిక మార్పిడి: 1 టీస్పూన్ = 5ml',
    'details.barcode': 'బార్కోడ్',
    'details.price': 'ధర',
    'details.scanAnother': 'మరొక ఉత్పత్తిని స్కాన్ చేయండి',
    'details.ingredients': 'పదార్థాలు',
    'details.totalVolume': 'మొత్తం పరిమాణం',
    'details.teaspoons': 'టీస్పూన్లు',
    'details.noIngredients': 'ఈ ఉత్పత్తికి పదార్థాల సమాచారం లేదు',

    // Health Meter
    'health.overall': 'మొత్తం ఆరోగ్య రేటింగ్',
    'health.excellent': 'అద్భుతం',
    'health.good': 'మంచిది',
    'health.fair': 'సగటు',
    'health.poor': 'చెడు',
    'health.score': 'వీరికి స్కోర్',
    'health.caffeine': 'కెఫీన్',
    'health.sugar': 'చక్కెర',
    'health.category': 'వర్గం',
    'health.benefits': 'వయస్సు-నిర్దిష్ట ప్రయోజనాలు',
    'health.recommendations': 'వీరికి సిఫార్సులు',
    'health.alert': 'ఆరోగ్య హెచ్చరిక',
    'health.alertDesc': 'అధిక కంటెంట్ కారణంగా ఈ ఉత్పత్తి సరిపోకపోవచ్చు. ఆరోగ్యకరమైన ప్రత్యామ్నాయాలను పరిగణించండి.',
    'health.disclaimer': 'ఈ ఆరోగ్య మూల్యాంకనం ఉత్పత్తి కూర్పు మరియు సాధారణ వయస్సు-సమూహ ఆరోగ్య మార్గదర్శకాలపై ఆధారపడి ఉంటుంది.',

    // Healthy Alternatives
    'alternatives.title': 'ఆరోగ్యకరమైన ప్రత్యామ్నాయాలు',
    'alternatives.subtitle': 'మెరుగైన ఆరోగ్యం కోసం సేంద్రీయ మరియు సహజ ఉత్పత్తులు',
    'alternatives.unhealthyAlert': 'ఈ ఉత్పత్తి ఆరోగ్య స్కోర్ తక్కువగా ఉంది. దిగువన ఉన్న ఆరోగ్యకరమైన ప్రత్యామ్నాయాలను సిఫార్సు చేస్తున్నాము.',
    'alternatives.poorAlert': 'ఈ ఉత్పత్తి ఆరోగ్య స్కోర్ మధ్యస్థంగా ఉంది. మీ ఆహారాన్ని మెరుగుపరచడానికి ఈ ఆరోగ్యకరమైన ఎంపికలను పరిగణించండి.',
    'alternatives.boost': 'పెరుగుదల',
    'alternatives.improvement': 'ఈ ప్రత్యామ్నాయాలకు మారడం వల్ల మీ ఆరోగ్యం మెరుగుపడుతుంది',
    'alternatives.sugar': 'చక్కెర',
    'alternatives.caffeine': 'కెఫీన్',

    // Age Groups
    'age.child': 'పిల్లలు',
    'age.student': 'విద్యార్థి',
    'age.adult': 'పెద్దలు',
    'age.senior': 'సీనియర్లు',
    'age.children': 'పిల్లలు',
    'age.students': 'విద్యార్థులు',
    'age.adults': 'పెద్దలు',
    'age.seniors': 'సీనియర్లు',

    // Common
    'common.loading': 'లోడ్ అవుతోంది...',
    'common.error': 'లోపం',
    'common.success': 'విజయం',
    'common.cancel': 'రద్దు చేయండి',
    'common.save': 'సేవ్ చేయండి',
    'common.searching': 'వెతుకుతున్నాము...',
    'common.notFound': 'ఉత్పత్తి దొరకలేదు',
    'common.tryManual': 'బార్కోడ్‌ను మాన్యువల్‌గా నమోదు చేయడానికి ప్రయత్నించండి',
  },

  bn: {
    // App
    'app.title': 'স্ক্যান টু ডিকোড',
    'app.subtitle': 'পণ্যের উপাদান এবং স্বাস্থ্য তথ্য আবিষ্কার করুন',

    // Login
    'login.title': 'স্ক্যান টু ডিকোডে স্বাগতম',
    'login.subtitle': 'যেকোনো পণ্যের বারকোড স্ক্যান করে উপাদান এবং স্বাস্থ্য তথ্য পান',
    'login.name': 'আপনার নাম',
    'login.namePlaceholder': 'আপনার নাম লিখুন',
    'login.age': 'আপনার বয়স',
    'login.agePlaceholder': 'আপনার বয়স লিখুন',
    'login.city': 'আপনার শহর',
    'login.cityPlaceholder': 'আপনার শহর লিখুন',
    'login.category': 'আপনার বিভাগ নির্বাচন করুন',
    'login.category.dietician': 'পুষ্টিবিদ',
    'login.category.gym_freak': 'ফিটনেস উত্সাহী',
    'login.category.adult': 'প্রাপ্তবয়স্ক',
    'login.category.student': 'ছাত্র',
    'login.start': 'স্ক্যান শুরু করুন',

    // Scanner
    'scanner.title': 'স্ক্যান টু ডিকোড',
    'scanner.subtitle': 'বারকোডে আপনার ক্যামেরা তাক করুন',
    'scanner.openCamera': 'ক্যামেরা খুলুন',
    'scanner.orManual': 'অথবা ম্যানুয়ালি লিখুন',
    'scanner.placeholder': 'বারকোড নম্বর লিখুন',
    'scanner.decodeProduct': 'পণ্য ডিকোড করুন',
    'scanner.scanning': 'স্থির রাখুন - বারকোড স্ক্যান হচ্ছে...',
    'scanner.closeCamera': 'ক্যামেরা বন্ধ করুন',
    'scanner.cameraError': 'ক্যামেরা ত্রুটি',

    // Product Details
    'details.title': 'পণ্যের বিবরণ',
    'details.subtitle': 'সম্পূর্ণ উপাদান বিবরণ',
    'details.measurementNote': 'পরিমাপ নোট',
    'details.measurementDesc': 'উপাদানের পরিমাণ চামচে পরিমাপ করা হয়েছে - স্ট্যান্ডার্ড রূপান্তর: ১ চা-চামচ = ৫ml',
    'details.barcode': 'বারকোড',
    'details.price': 'মূল্য',
    'details.scanAnother': 'অন্য পণ্য স্ক্যান করুন',
    'details.ingredients': 'উপাদান',
    'details.totalVolume': 'মোট পরিমাণ',
    'details.teaspoons': 'চা-চামচ',
    'details.noIngredients': 'এই পণ্যের জন্য কোনো উপাদান তথ্য নেই',

    // Health Meter
    'health.overall': 'সামগ্রিক স্বাস্থ্য রেটিং',
    'health.excellent': 'চমৎকার',
    'health.good': 'ভালো',
    'health.fair': 'গড়',
    'health.poor': 'খারাপ',
    'health.score': 'এদের জন্য স্কোর',
    'health.caffeine': 'ক্যাফেইন',
    'health.sugar': 'চিনি',
    'health.category': 'বিভাগ',
    'health.benefits': 'বয়স-নির্দিষ্ট সুবিধা',
    'health.recommendations': 'এদের জন্য সুপারিশ',
    'health.alert': 'স্বাস্থ্য সতর্কতা',
    'health.alertDesc': 'উচ্চ উপাদানের কারণে এই পণ্যটি উপযুক্ত নাও হতে পারে। স্বাস্থ্যকর বিকল্প বিবেচনা করুন।',
    'health.disclaimer': 'এই স্বাস্থ্য মূল্যায়ন পণ্যের গঠন এবং সাধারণ বয়স-গোষ্ঠীর স্বাস্থ্য নির্দেশিকার উপর ভিত্তি করে।',

    // Healthy Alternatives
    'alternatives.title': 'স্বাস্থ্যকর বিকল্প',
    'alternatives.subtitle': 'ভালো স্বাস্থ্যের জন্য জৈব এবং প্রাকৃতিক পণ্য',
    'alternatives.unhealthyAlert': 'এই পণ্যের স্বাস্থ্য স্কোর কম। আমরা নিচে স্বাস্থ্যকর বিকল্প সুপারিশ করছি।',
    'alternatives.poorAlert': 'এই পণ্যের স্বাস্থ্য স্কোর মোটামুটি। আপনার খাদ্য উন্নত করতে এই স্বাস্থ্যকর বিকল্পগুলো বিবেচনা করুন।',
    'alternatives.boost': 'বৃদ্ধি',
    'alternatives.improvement': 'এই বিকল্পগুলোতে পরিবর্তন করলে আপনার স্বাস্থ্য উন্নত হতে পারে',
    'alternatives.sugar': 'চিনি',
    'alternatives.caffeine': 'ক্যাফেইন',

    // Age Groups
    'age.child': 'শিশু',
    'age.student': 'ছাত্র',
    'age.adult': 'প্রাপ্তবয়স্ক',
    'age.senior': 'প্রবীণ',
    'age.children': 'শিশুদের',
    'age.students': 'ছাত্রদের',
    'age.adults': 'প্রাপ্তবয়স্কদের',
    'age.seniors': 'প্রবীণদের',

    // Common
    'common.loading': 'লোড হচ্ছে...',
    'common.error': 'ত্রুটি',
    'common.success': 'সফল',
    'common.cancel': 'বাতিল করুন',
    'common.save': 'সংরক্ষণ করুন',
    'common.searching': 'খোঁজা হচ্ছে...',
    'common.notFound': 'পণ্য পাওয়া যায়নি',
    'common.tryManual': 'বারকোড ম্যানুয়ালি লেখার চেষ্টা করুন',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export const languageNames: Record<Language, string> = {
  en: 'English',
  hi: 'हिन्दी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  bn: 'বাংলা',
};
