export interface TextbookSentence {
  id: string;
  speakerZh: string;
  speakerVi: string;
  avatar: string;
  chinese: string;
  pinyin: string;
  vietnamese: string;
}

export interface TextbookVocabulary {
  id: string;
  chinese: string;
  pinyin: string;
  vietnamese: string;
  partOfSpeech: string;
}

export interface ReadingQuestion {
  id: string;
  questionZh: string;
  questionVi: string;
  options: {
    id: string;
    textZh: string;
    textVi: string;
    isCorrect: boolean;
  }[];
  explanationVi: string;
}

export interface TextbookLesson {
  id: string;
  titleZh: string;
  titleVi: string;
  topic: string;
  backgroundVi: string;
  coverEmoji: string;
  sentences: TextbookSentence[];
  vocabulary: TextbookVocabulary[];
  comprehensionQuestions: ReadingQuestion[];
}

export const TEXTBOOK_LESSONS: TextbookLesson[] = [
  {
    id: 'lesson_1',
    titleZh: '课文一：放学后去喝奶茶',
    titleVi: 'Bài khóa 1: Tan học cùng đi uống trà sữa',
    topic: 'Gọi trà sữa, chọn đường đá topping và quét mã MoMo',
    backgroundVi: 'Tan học, Tiểu Minh (小明) và Lan Lan (兰兰) cùng đến quán trà sữa CháYǔ để gọi đồ uống yêu thích.',
    coverEmoji: '🧋',
    sentences: [
      {
        id: 'l1_1',
        speakerZh: '小明',
        speakerVi: 'Tiểu Minh',
        avatar: '👦',
        chinese: '兰兰，放学了，今天天气真热，你想喝什么？',
        pinyin: 'Lánlan, fàngxué le, jīntiān tiānqì zhēn rè, nǐ xiǎng hē shénme?',
        vietnamese: 'Lan Lan, tan học rồi, hôm nay trời nóng thật đấy, bạn muốn uống gì?',
      },
      {
        id: 'l1_2',
        speakerZh: '兰兰',
        speakerVi: 'Lan Lan',
        avatar: '👧',
        chinese: '我最喜欢喝芝士奶盖绿茶！你喜欢喝什么？',
        pinyin: 'Wǒ zuì xǐhuān hē zhīshì nǎi gài lǜchá! Nǐ xǐhuān hē shénme?',
        vietnamese: 'Mình thích uống trà xanh kem cheese nhất! Cậu thích uống gì?',
      },
      {
        id: 'l1_3',
        speakerZh: '小明',
        speakerVi: 'Tiểu Minh',
        avatar: '👦',
        chinese: '我喜欢喝酸甜的，我要一杯蜂蜜柠檬茶。我们进店点单吧！',
        pinyin: 'Wǒ xǐhuān hē suāntián de, wǒ yào yī bēi fēngmì níngméngchá. Wǒmen jìn diàn diǎndān ba!',
        vietnamese: 'Mình thích uống vị chua ngọt, mình muốn một ly trà chanh mật ong. Chúng mình vào quán gọi món đi!',
      },
      {
        id: 'l1_4',
        speakerZh: '店员',
        speakerVi: 'Thu ngân',
        avatar: '🧑‍🍳',
        chinese: '您好，欢迎光临！两位请问喝点什么？',
        pinyin: 'Nín hǎo, huānyíng guānglín! Liǎng wèi qǐngwèn hē diǎn shénme?',
        vietnamese: 'Xin chào quý khách! Hai bạn muốn uống gì ạ?',
      },
      {
        id: 'l1_5',
        speakerZh: '小明',
        speakerVi: 'Tiểu Minh',
        avatar: '👦',
        chinese: '你好，我们要一杯大杯蜂蜜柠檬茶，和一杯中杯芝士奶盖绿茶。',
        pinyin: 'Nǐ hǎo, wǒmen yào yī bēi dàbēi fēngmì níngméngchá, hé yī bēi zhōngbēi zhīshì nǎi gài lǜchá.',
        vietnamese: 'Chào anh, chúng tôi muốn 1 ly trà chanh mật ong size lớn, và 1 ly trà xanh kem cheese size vừa.',
      },
      {
        id: 'l1_6',
        speakerZh: '店员',
        speakerVi: 'Thu ngân',
        avatar: '🧑‍🍳',
        chinese: '好的，请问甜度和冰块怎么选？需要加料吗？',
        pinyin: 'Hǎo de, qǐngwèn tiándù hé bīngkuài zěnme xuǎn? Xūyào jiāliào ma?',
        vietnamese: 'Dạ được ạ, cho hỏi độ ngọt và lượng đá chọn thế nào? Có cần thêm topping không?',
      },
      {
        id: 'l1_7',
        speakerZh: '兰兰',
        speakerVi: 'Lan Lan',
        avatar: '👧',
        chinese: '奶盖绿茶要半糖、少冰，加一份珍珠。',
        pinyin: 'Nǎigài lǜchá yào bàn táng, shǎo bīng, jiā yī fèn zhēnzhū.',
        vietnamese: 'Trà xanh kem cheese lấy 50% đường, ít đá, thêm một phần trân châu.',
      },
      {
        id: 'l1_8',
        speakerZh: '小明',
        speakerVi: 'Tiểu Minh',
        avatar: '👦',
        chinese: '柠檬茶要少糖、正常冰，不加料。我们要在这喝。',
        pinyin: 'Níngméngchá yào shǎo táng, zhèngcháng bīng, bù jiāliào. Wǒmen yào zài zhè hē.',
        vietnamese: 'Trà chanh lấy 70% đường, đá bình thường, không thêm topping. Chúng tôi uống tại quán.',
      },
      {
        id: 'l1_9',
        speakerZh: '店员',
        speakerVi: 'Thu ngân',
        avatar: '🧑‍🍳',
        chinese: '一共八万五千越盾。请问怎么支付？',
        pinyin: 'Yīgòng bā wàn wǔ qiān yuèdùn. Qǐngwèn zěnme zhīfù?',
        vietnamese: 'Tổng cộng 85.000 VNĐ. Cho hỏi bạn thanh toán như thế nào ạ?',
      },
      {
        id: 'l1_10',
        speakerZh: '小明',
        speakerVi: 'Tiểu Minh',
        avatar: '👦',
        chinese: '可以扫MoMo码吗？',
        pinyin: 'Kěyǐ sǎo MoMo mǎ ma?',
        vietnamese: 'Có thể quét mã MoMo không ạ?',
      },
      {
        id: 'l1_11',
        speakerZh: '店员',
        speakerVi: 'Thu ngân',
        avatar: '🧑‍🍳',
        chinese: '可以，请扫柜台上的二维码。这是您的小票，请稍等叫号取餐。',
        pinyin: 'Kěyǐ, qǐng sǎo guìtái shàng de èrwéimǎ. Zhè shì nín de xiǎopiào, qǐng shāo děng jiàohào qǔ cān.',
        vietnamese: 'Được ạ, mời bạn quét mã QR trên quầy. Đây là hóa đơn của bạn, xin chờ gọi số lấy nước nhé.',
      },
    ],
    vocabulary: [
      { id: 'v1', chinese: '放学', pinyin: 'fàngxué', vietnamese: 'Tan học', partOfSpeech: 'động từ' },
      { id: 'v2', chinese: '喜欢', pinyin: 'xǐhuān', vietnamese: 'Thích', partOfSpeech: 'động từ' },
      { id: 'v3', chinese: '最', pinyin: 'zuì', vietnamese: 'Nhất', partOfSpeech: 'phó từ' },
      { id: 'v4', chinese: '酸甜', pinyin: 'suāntián', vietnamese: 'Chua ngọt', partOfSpeech: 'tính từ' },
      { id: 'v5', chinese: '甜度', pinyin: 'tiándù', vietnamese: 'Độ ngọt', partOfSpeech: 'danh từ' },
      { id: 'v6', chinese: '加料', pinyin: 'jiāliào', vietnamese: 'Thêm topping', partOfSpeech: 'động từ' },
      { id: 'v7', chinese: '扫码', pinyin: 'sǎomǎ', vietnamese: 'Quét mã QR', partOfSpeech: 'động từ' },
      { id: 'v8', chinese: '叫号', pinyin: 'jiàohào', vietnamese: 'Gọi số thứ tự', partOfSpeech: 'động từ' },
    ],
    comprehensionQuestions: [
      {
        id: 'cq1',
        questionZh: '兰兰最喜欢喝什么饮品？',
        questionVi: 'Lan Lan thích uống món đồ uống nào nhất?',
        options: [
          { id: 'o1', textZh: '蜂蜜柠檬茶', textVi: 'Trà chanh mật ong', isCorrect: false },
          { id: 'o2', textZh: '芝士奶盖绿茶', textVi: 'Trà xanh kem cheese', isCorrect: true },
          { id: 'o3', textZh: '西瓜汁', textVi: 'Nước ép dưa hấu', isCorrect: false },
        ],
        explanationVi: 'Trong bài, Lan Lan nói: "我最喜欢喝芝士奶盖绿茶！"',
      },
      {
        id: 'cq2',
        questionZh: '兰兰的奶盖绿茶加了什么料？',
        questionVi: 'Trà xanh kem cheese của Lan Lan thêm topping gì?',
        options: [
          { id: 'o1', textZh: '椰果', textVi: 'Thạch dừa', isCorrect: false },
          { id: 'o2', textZh: '布丁', textVi: 'Pudding', isCorrect: false },
          { id: 'o3', textZh: '珍珠', textVi: 'Trân châu', isCorrect: true },
        ],
        explanationVi: 'Lan Lan dặn thu ngân: "奶盖绿茶要半糖、少冰，加一份珍珠。"',
      },
      {
        id: 'cq3',
        questionZh: '小明用什么方式支付？',
        questionVi: 'Tiểu Minh dùng phương thức nào để thanh toán?',
        options: [
          { id: 'o1', textZh: '扫MoMo码', textVi: 'Quét mã MoMo', isCorrect: true },
          { id: 'o2', textZh: '付现金', textVi: 'Trả tiền mặt', isCorrect: false },
          { id: 'o3', textZh: '刷信用卡', textVi: 'Quẹt thẻ tín dụng', isCorrect: false },
        ],
        explanationVi: 'Tiểu Minh hỏi: "可以扫MoMo码吗？" và thu ngân đồng ý quét mã QR trên quầy.',
      },
    ],
  },
  {
    id: 'lesson_2',
    titleZh: '课文二：在越南咖啡馆',
    titleVi: 'Bài khóa 2: Tại quán cà phê Việt Nam',
    topic: 'Gọi Bạc xỉu, Cà phê sữa đá, điều chỉnh sữa đá',
    backgroundVi: 'David là bạn du học sinh lần đầu được bạn Việt Nam dẫn đi thưởng thức cà phê truyền thống.',
    coverEmoji: '☕',
    sentences: [
      {
        id: 'l2_1',
        speakerZh: '阿明',
        speakerVi: 'A Minh',
        avatar: '👦',
        chinese: '大卫，欢迎来到越南！你喝过越南咖啡吗？',
        pinyin: 'Dàwèi, huānyíng lái dào Yuènán! Nǐ hē guo Yuènán kāfēi ma?',
        vietnamese: 'David, chào mừng bạn đến Việt Nam! Bạn đã từng uống cà phê Việt Nam chưa?',
      },
      {
        id: 'l2_2',
        speakerZh: '大卫',
        speakerVi: 'David',
        avatar: '👱',
        chinese: '我还没喝过。越南有什么经典咖啡？',
        pinyin: 'Wǒ hái méi hē guo. Yuènán yǒu shénme jīngdiǎn kāfēi?',
        vietnamese: 'Mình chưa từng uống. Việt Nam có loại cà phê kinh điển nào vậy?',
      },
      {
        id: 'l2_3',
        speakerZh: '阿明',
        speakerVi: 'A Minh',
        avatar: '👦',
        chinese: '最出名的是冰炼乳咖啡和白咖啡（越南白咖啡）。白咖啡牛奶比较多，很香甜。',
        pinyin: 'Zuì chūmíng de shì bīng liànrǔ kāfēi hé bái kāfēi. Bái kāfēi niúnǎi bǐjiào duō, hěn xiāngtián.',
        vietnamese: 'Nổi tiếng nhất là Cà phê sữa đá và Bạc xỉu (cà phê trắng). Bạc xỉu nhiều sữa hơn, rất thơm ngọt.',
      },
      {
        id: 'l2_4',
        speakerZh: '大卫',
        speakerVi: 'David',
        avatar: '👱',
        chinese: '太好了，我不习惯太苦的，我想喝一杯越南白咖啡。',
        pinyin: 'Tài hǎo le, wǒ bù xíguàn tài kǔ de, wǒ xiǎng hē yī bēi Yuènán bái kāfēi.',
        vietnamese: 'Tuyệt quá, mình không quen uống đắng quá, mình muốn uống 1 ly bạc xỉu.',
      },
      {
        id: 'l2_5',
        speakerZh: '店员',
        speakerVi: 'Thu ngân',
        avatar: '🧑‍🍳',
        chinese: '您好！请问白咖啡要热的还是做冰的？',
        pinyin: 'Nín hǎo! Qǐngwèn bái kāfēi yào rè de háishì zuò bīng de?',
        vietnamese: 'Xin chào! Cho hỏi bạc xỉu bạn lấy nóng hay làm đá ạ?',
      },
      {
        id: 'l2_6',
        speakerZh: '大卫',
        speakerVi: 'David',
        avatar: '👱',
        chinese: '请帮我做冰的，少放点糖和炼乳。',
        pinyin: 'Qǐng bāng wǒ zuò bīng de, shǎo fàng diǎn táng hé liànrǔ.',
        vietnamese: 'Làm đá giúp mình nhé, cho ít đường và sữa đặc thôi.',
      },
      {
        id: 'l2_7',
        speakerZh: '阿明',
        speakerVi: 'A Minh',
        avatar: '👦',
        chinese: '给我来一杯冰炼乳咖啡，多放点碎冰。我们在这喝。支持银行转账吗？',
        pinyin: 'Gěi wǒ lái yī bēi bīng liànrǔ kāfēi, duō fàng diǎn suìbīng. Wǒmen zài zhè hē. Zhīchí yínháng zhuǎnzhàng ma?',
        vietnamese: 'Cho mình 1 ly cà phê sữa đá, thêm nhiều đá nhuyễn. Chúng mình uống ở đây. Quán có nhận chuyển khoản ngân hàng không?',
      },
      {
        id: 'l2_8',
        speakerZh: '店员',
        speakerVi: 'Thu ngân',
        avatar: '🧑‍🍳',
        chinese: '支持的，这是银行VietQR码，两杯一共六万二千越盾。',
        pinyin: 'Zhīchí de, zhè shì yínháng VietQR mǎ, liǎng bēi yīgòng liù wàn èr qiān yuèdùn.',
        vietnamese: 'Dạ có ạ, đây là mã VietQR ngân hàng, 2 ly tổng cộng 62.000 VNĐ.',
      },
    ],
    vocabulary: [
      { id: 'v2_1', chinese: '经典', pinyin: 'jīngdiǎn', vietnamese: 'Kinh điển', partOfSpeech: 'tính từ' },
      { id: 'v2_2', chinese: '出名', pinyin: 'chūmíng', vietnamese: 'Nổi tiếng', partOfSpeech: 'tính từ' },
      { id: 'v2_3', chinese: '习惯', pinyin: 'xíguàn', vietnamese: 'Quen với', partOfSpeech: 'động từ' },
      { id: 'v2_4', chinese: '苦', pinyin: 'kǔ', vietnamese: 'Đắng', partOfSpeech: 'tính từ' },
      { id: 'v2_5', chinese: '热', pinyin: 'rè', vietnamese: 'Nóng', partOfSpeech: 'tính từ' },
      { id: 'v2_6', chinese: '冰', pinyin: 'bīng', vietnamese: 'Đá / Lạnh', partOfSpeech: 'danh từ' },
      { id: 'v2_7', chinese: '炼乳', pinyin: 'liànrǔ', vietnamese: 'Sữa đặc', partOfSpeech: 'danh từ' },
    ],
    comprehensionQuestions: [
      {
        id: 'cq2_1',
        questionZh: '为什么大卫选择喝越南白咖啡？',
        questionVi: 'Tại sao David lại chọn uống Bạc xỉu?',
        options: [
          { id: 'o1', textZh: '因为他不习惯喝太苦的', textVi: 'Vì bạn ấy không quen uống quá đắng', isCorrect: true },
          { id: 'o2', textZh: '因为白咖啡没有牛奶', textVi: 'Vì bạc xỉu không có sữa', isCorrect: false },
          { id: 'o3', textZh: '因为今天天气很冷', textVi: 'Vì hôm nay trời rất lạnh', isCorrect: false },
        ],
        explanationVi: 'David nói: "我不习惯太苦的，我想喝一杯越南白咖啡。"',
      },
      {
        id: 'cq2_2',
        questionZh: '店员问白咖啡要热的还是做冰的，“热”是什么意思？',
        questionVi: 'Thu ngân hỏi bạc xỉu lấy nóng hay đá, chữ "热" có nghĩa là gì?',
        options: [
          { id: 'o1', textZh: 'Nóng', textVi: 'Nóng', isCorrect: true },
          { id: 'o2', textZh: 'Uống', textVi: 'Uống', isCorrect: false },
          { id: 'o3', textZh: 'Ít đá', textVi: 'Ít đá', isCorrect: false },
        ],
        explanationVi: '“热” (rè) có nghĩa là "Nóng", phân biệt với "冰" (bīng - đá).',
      },
    ],
  },
];
