export interface VocabItem {
  id: string;
  category: 'drink' | 'sweetness' | 'ice' | 'size' | 'action' | 'payment';
  chinese: string;
  pinyin: string;
  vietnamese: string;
  exampleZh: string;
  examplePinyin: string;
  exampleVi: string;
}

export const VOCABULARY_LIST: VocabItem[] = [
  // Sweetness
  {
    id: 'v_quan_tang',
    category: 'sweetness',
    chinese: '全糖',
    pinyin: 'quán táng',
    vietnamese: '100% đường (Toàn đường)',
    exampleZh: '我喜欢喝甜的，要全糖。',
    examplePinyin: 'Wǒ xǐhuān hē tián de, yào quán táng.',
    exampleVi: 'Tôi thích uống ngọt, cho 100% đường.',
  },
  {
    id: 'v_shao_tang',
    category: 'sweetness',
    chinese: '少糖',
    pinyin: 'shǎo táng',
    vietnamese: '70% đường (Ít đường)',
    exampleZh: '少糖刚刚好，不会太甜。',
    examplePinyin: 'Shǎo táng gāng gāng hǎo, bú huì tài tián.',
    exampleVi: '70% đường là vừa vặn, không quá ngọt.',
  },
  {
    id: 'v_ban_tang',
    category: 'sweetness',
    chinese: '半糖',
    pinyin: 'bàn táng',
    vietnamese: '50% đường (Nửa đường)',
    exampleZh: '请给我半糖，谢谢。',
    examplePinyin: 'Qǐng gěi wǒ bàn táng, xièxie.',
    exampleVi: 'Xin cho tôi 50% đường, cảm ơn.',
  },
  {
    id: 'v_wei_tang',
    category: 'sweetness',
    chinese: '微糖',
    pinyin: 'wēi táng',
    vietnamese: '30% đường (Hơi ngọt)',
    exampleZh: '我在减脂，只要微糖。',
    examplePinyin: 'Wǒ zài jiǎnzhǐ, zhǐ yào wēi táng.',
    exampleVi: 'Tôi đang giảm cân, chỉ cần 30% đường.',
  },
  {
    id: 'v_wu_tang',
    category: 'sweetness',
    chinese: '无糖',
    pinyin: 'wú táng',
    vietnamese: '0% đường (Không đường)',
    exampleZh: '西瓜汁本来就很甜，无糖就可以了。',
    examplePinyin: 'Xīguā zhī běnlái jiù hěn tián, wú táng jiù kěyǐ le.',
    exampleVi: 'Nước ép dưa hấu vốn dĩ đã ngọt rồi, không đường là được.',
  },

  // Ice levels
  {
    id: 'v_zheng_chang_bing',
    category: 'ice',
    chinese: '正常冰',
    pinyin: 'zhèng cháng bīng',
    vietnamese: 'Đá bình thường',
    exampleZh: '天气很热，我要正常冰。',
    examplePinyin: 'Tiānqì hěn rè, wǒ yào zhèngcháng bīng.',
    exampleVi: 'Trời rất nóng, tôi lấy lượng đá bình thường.',
  },
  {
    id: 'v_shao_bing',
    category: 'ice',
    chinese: '少冰',
    pinyin: 'shǎo bīng',
    vietnamese: 'Ít đá',
    exampleZh: '一杯蜂蜜柠檬茶，少冰。',
    examplePinyin: 'Yī bēi fēngmì níngméngchá, shǎo bīng.',
    exampleVi: 'Một ly trà chanh mật ong, ít đá.',
  },
  {
    id: 'v_qu_bing',
    category: 'ice',
    chinese: '去冰',
    pinyin: 'qù bīng',
    vietnamese: 'Không đá (Bỏ đá)',
    exampleZh: '我感冒了，这杯要常温或去冰。',
    examplePinyin: 'Wǒ gǎnmào le, zhè bēi yào chángwēn huò qù bīng.',
    exampleVi: 'Tôi bị cảm rồi, ly này lấy nhiệt độ phòng hoặc không đá.',
  },
  {
    id: 'v_re_yin',
    category: 'ice',
    chinese: '做热的 / 热饮',
    pinyin: 'zuò rè de / rè yǐn',
    vietnamese: 'Làm nóng / Đồ uống nóng',
    exampleZh: '薄荷可可以做热的吗？',
    examplePinyin: 'Bòhé kěkě kěyǐ zuò rè de ma?',
    exampleVi: 'Cacao bạc hà có làm nóng được không?',
  },

  // Cup sizes
  {
    id: 'v_xiao_bei',
    category: 'size',
    chinese: '小杯',
    pinyin: 'xiǎo bēi',
    vietnamese: 'Ly nhỏ (Size S)',
    exampleZh: '我要小杯咖啡。',
    examplePinyin: 'Wǒ yào xiǎobēi kāfēi.',
    exampleVi: 'Tôi muốn ly cà phê nhỏ.',
  },
  {
    id: 'v_zhong_bei',
    category: 'size',
    chinese: '中杯',
    pinyin: 'zhōng bēi',
    vietnamese: 'Ly vừa (Size M)',
    exampleZh: '默认是中杯吗？',
    examplePinyin: 'Mòrèn shì zhōngbēi ma?',
    exampleVi: 'Mặc định là ly size vừa đúng không?',
  },
  {
    id: 'v_da_bei',
    category: 'size',
    chinese: '大杯',
    pinyin: 'dà bēi',
    vietnamese: 'Ly lớn (Size L)',
    exampleZh: '大杯加两块钱。',
    examplePinyin: 'Dàbēi jiā liǎng kuài qián.',
    exampleVi: 'Size lớn thêm hai đồng.',
  },

  // Actions & Phrases
  {
    id: 'v_dian_dan',
    category: 'action',
    chinese: '点单 / 点菜',
    pinyin: 'diǎn dān / diǎn cài',
    vietnamese: 'Gọi món / Đặt món',
    exampleZh: '你好，请问现在可以点单了吗？',
    examplePinyin: 'Nǐ hǎo, qǐngwèn xiànzài kěyǐ diǎndān le ma?',
    exampleVi: 'Xin chào, cho hỏi bây giờ tôi có thể gọi món được chưa?',
  },
  {
    id: 'v_da_bao',
    category: 'action',
    chinese: '打包',
    pinyin: 'dǎ bāo',
    vietnamese: 'Mang về (Takeaway)',
    exampleZh: '这两杯都打包带走。',
    examplePinyin: 'Zhè liǎng bēi dōu dǎbāo dài zǒu.',
    exampleVi: 'Hai ly này đều mang về hết nhé.',
  },
  {
    id: 'v_tang_shi',
    category: 'action',
    chinese: '堂食 / 在这喝',
    pinyin: 'táng shí / zài zhè hē',
    vietnamese: 'Dùng tại quán / Uống ở đây',
    exampleZh: '我们在这喝，不需要塑料袋。',
    examplePinyin: 'Wǒmen zài zhè hē, bù xūyào sùliàodài.',
    exampleVi: 'Chúng tôi uống ở đây, không cần túi nilon đâu.',
  },
  {
    id: 'v_tui_jian',
    category: 'action',
    chinese: '推荐',
    pinyin: 'tuī jiàn',
    vietnamese: 'Gợi ý / Đề xuất',
    exampleZh: '你们店有什么招牌推荐吗？',
    examplePinyin: 'Nǐmen diàn yǒu shénme zhāopai tuījiàn ma?',
    exampleVi: 'Quán bạn có món ngon đặc trưng nào giới thiệu không?',
  },
  {
    id: 'v_mai_dan',
    category: 'payment',
    chinese: '买单 / 结账',
    pinyin: 'mǎi dān / jié zhàng',
    vietnamese: 'Thanh toán / Tính tiền',
    exampleZh: '你好，一共多少钱？买单。',
    examplePinyin: 'Nǐ hǎo, yīgòng duōshao qián? Mǎidān.',
    exampleVi: 'Xin chào, tổng cộng bao nhiêu tiền vậy? Tính tiền nhé.',
  },
];

export const GRAMMAR_PATTERNS = [
  {
    title: 'Cấu trúc gọi món chuẩn mực',
    patternZh: '我要 + [Số lượng + Ly] + [Tên món] + [Độ ngọt] + [Lượng đá] + [Topping] + [Mang về/Ở lại]',
    patternPinyin: 'Wǒ yào + [Yī bēi...] + [Món...] + [Tiándù...] + [Bīngdù...] + [Jiā topping] + [Dǎbāo/Tángshí]',
    exampleZh: '我要一杯中杯蜂蜜柠檬茶，半糖，少冰，加珍珠，打包。',
    examplePinyin: 'Wǒ yào yī bēi zhōngbēi fēngmì níngméngchá, bàn táng, shǎo bīng, jiā zhēnzhū, dǎbāo.',
    translationVi: 'Tôi muốn 1 ly trà chanh mật ong size vừa, 50% đường, ít đá, thêm trân châu, mang về.',
  },
  {
    title: 'Hỏi đề xuất món ngon của quán',
    patternZh: '请问你们店有什么好喝的推荐吗？ / 哪款是招牌？',
    patternPinyin: 'Qǐngwèn nǐmen diàn yǒu shénme hǎohē de tuījiàn ma? / Nǎ kuǎn shì zhāopai?',
    exampleZh: '店员：我们的芝士奶盖绿茶和牛油果冰沙都很受欢迎！',
    examplePinyin: 'Diànyuán: Wǒmen de zhīshì nǎigài lǜchá hé niúyóuguǒ bīngshā dōu hěn shòu huānyíng!',
    translationVi: 'Nhân viên: Trà xanh kem cheese và sinh tố bơ của chúng tôi đều rất được ưa chuộng!',
  },
  {
    title: 'Hỏi hình thức thanh toán',
    patternZh: '请问支持微信/支付宝吗？还是付现金？',
    patternPinyin: 'Qǐngwèn zhīchí Wēixìn / Zhīfùbǎo ma? Háishì fù xiànjīn?',
    exampleZh: '顾客：可以扫码支付吗？ / 店员：可以，扫这个二维码。',
    examplePinyin: 'Gùkè: Kěyǐ sǎomǎ zhīfù ma? / Diànyuán: Kěyǐ, sǎo zhè ge èrwéimǎ.',
    translationVi: 'Khách: Có thể quét mã thanh toán không? / Nhân viên: Được ạ, quét mã QR này nhé.',
  },
];
