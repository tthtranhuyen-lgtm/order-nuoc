export interface GrammarRule {
  id: string;
  titleZh: string;
  titleVi: string;
  formulaZh: string;
  formulaPinyin: string;
  formulaVi: string;
  explanationVi: string;
  examples: {
    id: string;
    chinese: string;
    pinyin: string;
    vietnamese: string;
  }[];
}

export interface OrderingStepDialogue {
  step: number;
  stepNameVi: string;
  stepNameZh: string;
  cashier: {
    chinese: string;
    pinyin: string;
    vietnamese: string;
  };
  customerOptions: {
    id: string;
    chinese: string;
    pinyin: string;
    vietnamese: string;
    tag?: string;
  }[];
}

export const ORDERING_STEPS_DIALOGUES: OrderingStepDialogue[] = [
  {
    step: 1,
    stepNameVi: 'Bước 1: Chào hỏi & Hỏi món',
    stepNameZh: '第一步：问候与点单',
    cashier: {
      chinese: '您好，欢迎光临！请问喝点什么？',
      pinyin: 'Nín hǎo, huānyíng guānglín! Qǐngwèn hē diǎn shénme?',
      vietnamese: 'Xin chào, hoan nghênh quý khách! Bạn muốn uống gì ạ?',
    },
    customerOptions: [
      {
        id: 'c1_1',
        chinese: '你好，我要一杯蜂蜜柠檬茶。',
        pinyin: 'Nǐ hǎo, wǒ yào yī bēi fēngmì níngméngchá.',
        vietnamese: 'Chào bạn, cho tôi 1 ly trà chanh mật ong.',
        tag: 'Gọi 1 món chuẩn',
      },
      {
        id: 'c1_2',
        chinese: '给我来一杯芝士奶盖绿茶。',
        pinyin: 'Gěi wǒ lái yī bēi zhīshì nǎi gài lǜchá.',
        vietnamese: 'Cho tôi một ly trà xanh kem cheese.',
        tag: 'Dùng từ "来"',
      },
      {
        id: 'c1_3',
        chinese: '你们店有什么好喝的招牌推荐吗？',
        pinyin: 'Nǐmen diàn yǒu shénme hǎohē de zhāopai tuījiàn ma?',
        vietnamese: 'Quán bạn có món ngon đặc trưng nào giới thiệu không?',
        tag: 'Hỏi đề xuất',
      },
    ],
  },
  {
    step: 2,
    stepNameVi: 'Bước 2: Chọn Size Ly (Kích Cỡ)',
    stepNameZh: '第二步：选择杯型大小',
    cashier: {
      chinese: '请问要中杯还是大杯？',
      pinyin: 'Qǐngwèn yào zhōngbēi háishì dàbēi?',
      vietnamese: 'Cho hỏi bạn muốn lấy ly size vừa hay size lớn?',
    },
    customerOptions: [
      {
        id: 'c2_1',
        chinese: '中杯就可以了，谢谢。',
        pinyin: 'Zhōngbēi jiù kěyǐ le, xièxie.',
        vietnamese: 'Ly vừa là được rồi, cảm ơn bạn.',
        tag: 'Size vừa',
      },
      {
        id: 'c2_2',
        chinese: '帮我做大杯的。',
        pinyin: 'Bāng wǒ zuò dàbēi de.',
        vietnamese: 'Làm giúp tôi ly size lớn nhé.',
        tag: 'Size lớn',
      },
      {
        id: 'c2_3',
        chinese: '有小杯吗？我要小杯。',
        pinyin: 'Yǒu xiǎobēi ma? Wǒ yào xiǎobēi.',
        vietnamese: 'Có ly nhỏ không? Tôi lấy ly nhỏ.',
        tag: 'Size nhỏ',
      },
    ],
  },
  {
    step: 3,
    stepNameVi: 'Bước 3: Chọn Độ Ngọt & Lượng Đá',
    stepNameZh: '第三步：调整甜度与冰块',
    cashier: {
      chinese: '甜度和冰块怎么选？要几分糖？',
      pinyin: 'Tiándù hé bīngkuài zěnme xuǎn? Yào jǐ fēn táng?',
      vietnamese: 'Độ ngọt và đá bạn chọn như thế nào? Lấy bao nhiêu phần đường?',
    },
    customerOptions: [
      {
        id: 'c3_1',
        chinese: '少糖，少冰。',
        pinyin: 'Shǎo táng, shǎo bīng.',
        vietnamese: '70% đường (ít ngọt), ít đá.',
        tag: 'Khuyên dùng',
      },
      {
        id: 'c3_2',
        chinese: '半糖，去冰。',
        pinyin: 'Bàn táng, qù bīng.',
        vietnamese: '50% đường (nửa đường), không đá.',
        tag: 'Ít đường',
      },
      {
        id: 'c3_3',
        chinese: '微糖，做热的。',
        pinyin: 'Wēi táng, zuò rè de.',
        vietnamese: '30% đường (hơi ngọt), làm nóng.',
        tag: 'Nóng (热)',
      },
      {
        id: 'c3_4',
        chinese: '我不喜欢太甜，无糖、正常冰。',
        pinyin: 'Wǒ bù xǐhuān tài tián, wú táng, zhèngcháng bīng.',
        vietnamese: 'Tôi không thích ngọt quá, không đường, đá bình thường.',
        tag: '0% đường',
      },
    ],
  },
  {
    step: 4,
    stepNameVi: 'Bước 4: Thêm Topping & Mang Về hay Tại Quán',
    stepNameZh: '第四步：加料与打包方式',
    cashier: {
      chinese: '需要加珍珠吗？在这喝还是打包？',
      pinyin: 'Xūyào jiā zhēnzhū ma? Zài zhè hē háishì dǎbāo?',
      vietnamese: 'Bạn có cần thêm trân châu không? Uống tại đây hay mang về?',
    },
    customerOptions: [
      {
        id: 'c4_1',
        chinese: '帮我加一份珍珠，我要打包带走。',
        pinyin: 'Bāng wǒ jiā yī fèn zhēnzhū, wǒ yào dǎbāo dài zǒu.',
        vietnamese: 'Thêm giúp tôi 1 phần trân châu, tôi mang về nhé.',
        tag: 'Thêm trân châu + Mang về',
      },
      {
        id: 'c4_2',
        chinese: '加一份椰果和芝士奶盖，我们在这喝。',
        pinyin: 'Jiā yī fèn yēguǒ hé zhīshì nǎi gài, wǒmen zài zhè hē.',
        vietnamese: 'Thêm thạch dừa và kem cheese, chúng tôi uống tại đây.',
        tag: 'Tại quán',
      },
      {
        id: 'c4_3',
        chinese: '不用加料，打包就可以了。',
        pinyin: 'Bú yòng jiāliào, dǎbāo jiù kěyǐ le.',
        vietnamese: 'Không cần thêm topping, mang về là được rồi.',
        tag: 'Không topping',
      },
    ],
  },
  {
    step: 5,
    stepNameVi: 'Bước 5: Hỏi Giá Tiền & Thanh Toán',
    stepNameZh: '第五步：问价与支付',
    cashier: {
      chinese: '一共八万五千越盾。请问扫码还是付现金？',
      pinyin: 'Yīgòng bā wàn wǔ qiān yuèdùn. Qǐngwèn sǎomǎ háishì fù xiànjīn?',
      vietnamese: 'Tổng cộng 85.000 VNĐ. Cho hỏi bạn quét mã hay trả tiền mặt?',
    },
    customerOptions: [
      {
        id: 'c5_1',
        chinese: '可以扫MoMo码吗？',
        pinyin: 'Kěyǐ sǎo MoMo mǎ ma?',
        vietnamese: 'Có thể quét mã MoMo không?',
        tag: 'Quét MoMo',
      },
      {
        id: 'c5_2',
        chinese: '我用银行转账，请给我二维码。',
        pinyin: 'Wǒ yòng yínháng zhuǎnzhàng, qǐng gěi wǒ èrwéimǎ.',
        vietnamese: 'Tôi chuyển khoản ngân hàng, vui lòng cho tôi mã QR.',
        tag: 'Ngân hàng / VietQR',
      },
      {
        id: 'c5_3',
        chinese: '我付现金，给你十万越盾。',
        pinyin: 'Wǒ fù xiànjīn, gěi nǐ shí wàn yuèdùn.',
        vietnamese: 'Tôi trả tiền mặt, gửi bạn mười vạn (100.000) VNĐ.',
        tag: 'Tiền mặt',
      },
    ],
  },
];

export const CORE_GRAMMAR_RULES: GrammarRule[] = [
  {
    id: 'g1',
    titleZh: '句型一：点单黄金万能公式',
    titleVi: 'Cấu trúc 1: Công thức vàng gọi món đồ uống',
    formulaZh: '我要 / 给我来 + [Số lượng + Ly] + [Size ly] + [Tên món] + [Độ ngọt] + [Lượng đá] + 加[Topping] + [Mang về/Ở lại]',
    formulaPinyin: 'Wǒ yào / Gěi wǒ lái + [Yī bēi] + [Dàbēi / Zhōngbēi] + [Món] + [Tiándù] + [Bīngdù] + [Jiā topping] + [Dǎbāo/Tángshí]',
    formulaVi: 'Tôi muốn / Cho tôi 1 ly [Size] [Tên món], [Độ ngọt], [Lượng đá], thêm [Topping], [Mang về/Tại quán].',
    explanationVi: 'Trong tiếng Trung, thứ tự mô tả ly nước đi từ số lượng -> kích thước ly -> tên món nước -> các tùy chỉnh phụ (đường, đá, topping) -> hình thức nhận đồ uống.',
    examples: [
      {
        id: 'eg1_1',
        chinese: '我要一杯大杯蜂蜜柠檬茶，半糖，少冰，加珍珠，打包。',
        pinyin: 'Wǒ yào yī bēi dàbēi fēngmì níngméngchá, bàn táng, shǎo bīng, jiā zhēnzhū, dǎbāo.',
        vietnamese: 'Tôi muốn 1 ly trà chanh mật ong size lớn, 50% đường, ít đá, thêm trân châu, mang về.',
      },
      {
        id: 'eg1_2',
        chinese: '给我来两杯中杯越南白咖啡，少糖，多放冰块，在这喝。',
        pinyin: 'Gěi wǒ lái liǎng bēi zhōngbēi Yuènán bái kāfēi, shǎo táng, duō fàng bīngkuài, zài zhè hē.',
        vietnamese: 'Cho tôi 2 ly bạc xỉu size vừa, ít đường, nhiều đá, uống tại quán.',
      },
    ],
  },
  {
    id: 'g2',
    titleZh: '句型二：选择疑问句 “……还是……”',
    titleVi: 'Cấu trúc 2: Câu hỏi lựa chọn với "还是" (hay là...)',
    formulaZh: 'A + 还是 (háishì) + B ？',
    formulaPinyin: 'A + háishì + B ?',
    formulaVi: 'Chọn A hay là B?',
    explanationVi: 'Dùng khi nhân viên đưa ra các lựa chọn để khách hàng quyết định.',
    examples: [
      {
        id: 'eg2_1',
        chinese: '请问中杯还是大杯？',
        pinyin: 'Qǐngwèn zhōngbēi háishì dàbēi?',
        vietnamese: 'Cho hỏi lấy ly vừa hay ly lớn?',
      },
      {
        id: 'eg2_2',
        chinese: '在这喝还是打包带走？',
        pinyin: 'Zài zhè hē háishì dǎbāo dài zǒu?',
        vietnamese: 'Uống ở đây hay mang đi?',
      },
      {
        id: 'eg2_3',
        chinese: '扫码还是付现金？',
        pinyin: 'Sǎomǎ háishì fù xiànjīn?',
        vietnamese: 'Quét mã hay trả tiền mặt?',
      },
      {
        id: 'eg2_4',
        chinese: '做热的还是做冰的？',
        pinyin: 'Zuò rè de háishì zuò bīng de?',
        vietnamese: 'Làm nóng hay làm đá?',
      },
    ],
  },
  {
    id: 'g3',
    titleZh: '句型三：表达增减 “少放点……” / “多放点……”',
    titleVi: 'Cấu trúc 3: Yêu cầu thêm bớt "少放点..." / "多放点..."',
    formulaZh: '帮我 + 少放点 / 多放点 + [Đường / Đá / Sữa]',
    formulaPinyin: 'Bāng wǒ + shǎo fàng diǎn / duō fàng diǎn + [Táng / Bīngkuài / Liànrǔ]',
    formulaVi: 'Giúp tôi cho ít lại / cho nhiều thêm [đường / đá / sữa đặc]...',
    explanationVi: 'Dùng khi muốn điều chỉnh khẩu vị riêng ngoài các mức có sẵn.',
    examples: [
      {
        id: 'eg3_1',
        chinese: '帮我少放点糖，我不喜欢喝太甜。',
        pinyin: 'Bāng wǒ shǎo fàng diǎn táng, wǒ bù xǐhuān hē tài tián.',
        vietnamese: 'Cho ít đường giúp tôi, tôi không thích uống ngọt quá.',
      },
      {
        id: 'eg3_2',
        chinese: '天气很热，帮我多放点冰块。',
        pinyin: 'Tiānqì hěn rè, bāng wǒ duō fàng diǎn bīngkuài.',
        vietnamese: 'Trời rất nóng, cho thêm nhiều đá giúp tôi nhé.',
      },
    ],
  },
  {
    id: 'g4',
    titleZh: '句型四：询问与结账支付',
    titleVi: 'Cấu trúc 4: Hỏi giá tiền và phương thức thanh toán',
    formulaZh: '请问一共多少钱？ / 可以扫 + [MoMo / 银行码] + 吗？',
    formulaPinyin: 'Qǐngwèn yīgòng duōshao qián? / Kěyǐ sǎo + [MoMo / Yínháng mǎ] + ma?',
    formulaVi: 'Xin hỏi tổng cộng bao nhiêu tiền? / Có thể quét mã [MoMo / Ngân hàng] không?',
    explanationVi: 'Học sinh dùng để thanh toán và giao dịch tự tin tại quầy.',
    examples: [
      {
        id: 'eg4_1',
        chinese: '你好，两杯一共多少钱？',
        pinyin: 'Nǐ hǎo, liǎng bēi yīgòng duōshao qián?',
        vietnamese: 'Xin chào, hai ly tổng cộng bao nhiêu tiền?',
      },
      {
        id: 'eg4_2',
        chinese: '可以扫MoMo码或者银行转账吗？',
        pinyin: 'Kěyǐ sǎo MoMo mǎ huòzhě yínháng zhuǎnzhàng ma?',
        vietnamese: 'Có thể quét mã MoMo hoặc chuyển khoản ngân hàng không?',
      },
      {
        id: 'eg4_3',
        chinese: '这是您的单子和小票，请稍等叫号。',
        pinyin: 'Zhè shì nín de dānzi hé xiǎopiào, qǐng shāo děng jiàohào.',
        vietnamese: 'Đây là hóa đơn của bạn, xin vui lòng chờ gọi số nhé.',
      },
    ],
  },
];
