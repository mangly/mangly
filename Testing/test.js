const Python_Communicator = require('../Utilities/Python_Communicator');
const Application_Utilities = require('../Utilities/Application_Utilities');

var assert = require('assert');
describe('Good NSSC vectors received of get_Model_NSSC.py', function () {
    it('should receive the correct vectors to plot them', function () {
        var x_vector = [];
        var y_vector = [];
        Python_Communicator.get_Model_NSSC('Symmetrical', { "samplingVector": [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "scenario": [{ "time": 0, "n": 15, "M": 1, "c": 1 }, { "time": 10, "n": 15, "M": 50, "c": 1 }, { "time": 50, "n": 15, "M": 1, "c": 1 }] }, 'Python_Scripts/get_Model_NSSC.py', function (result) {
            x_vector = result.x_vector;
            y_vector = result.y_vector;

            var comparision_x = Application_Utilities.Equals(x_vector, [0, 0.0017180705706564714, 0.003465658806170491, 0.005243271840855135, 0.007051425521948863, 0.00889064455930968, 0.010761462677681322, 0.012664422771575224, 0.014600077062813632, 0.016568987260779468, 0.018571724725419216, 0.02060887063304644, 0.02268101614499394, 0.024788762579163383, 0.026932721584522357, 0.029113515318599337, 0.03133177662802824, 0.033588149232194664, 0.035883287910037656, 0.038217858690060405, 0.04059253904360587, 0.043008018081452784, 0.0454649967537893, 0.04796418805362255, 0.05050631722368262, 0.05309212196688158, 0.05572235266038808, 0.05839777257338008, 0.061119158088538676, 0.06388729892734733, 0.06670299837926189, 0.06956707353481793, 0.07248035552274304, 0.07544368975114293, 0.07845793615283114, 0.08152396943487383, 0.08464267933242185, 0.08781497086690378, 0.09104176460865508, 0.09432399694405919, 0.09766262034727845, 0.10105860365665348, 0.10451293235585127, 0.1080266088598437, 0.1116006528057993, 0.11523610134897272, 0.11893400946367777, 0.12269545024943143, 0.12652151524235786, 0.13041331473194187, 0.13437197808322546, 0.13839865406453877, 0.14249451118086273, 0.1466607380129184, 0.1508985435620824, 0.15520915760122822, 0.1595938310315952, 0.16405383624578873, 0.16859046749701703, 0.17320504127467193, 0.1778988966863619, 0.18267339584650932, 0.1875299242716235, 0.19246989128236502, 0.19749473041251836, 0.2026058998249896, 0.20780488273495298, 0.21309318784026582, 0.2184723497592796, 0.22394392947617187, 0.22950951479393011, 0.23517072079511758, 0.24092919031055562, 0.24678659439605874, 0.2527446328173592, 0.2588050345433645, 0.2649695582478878, 0.2712399928199997, 0.2776181578831472, 0.28410590432319266, 0.2907051148255233, 0.29741770442139026, 0.3042456210436326, 0.3111908460919508, 0.3182553950078899, 0.3254413178597035, 0.332750699937264, 0.340185662357196, 0.3477483626784042, 0.355440995528178, 0.3632657932390526, 0.3712250264966109, 0.37932100499841737, 0.38755607812427, 0.39593263561797, 0.4044531082808033, 0.4131199686769376, 0.4219357318509376, 0.43090295605760914, 0.4400242435043801, 0.4493022411064391, 0.45873964125484523, 0.46833918259783636, 0.4781036508355593, 0.4880358795284557, 0.49813875091953497, 0.5084151967707756, 0.5188681992138959, 0.5295007916157416, 0.5403160594585411, 0.5513171412352855, 0.5625072293604899, 0.573889571096604, 0.585467469496338, 0.597244284361178, 0.6092234332163717, 0.6214083923026616, 0.6338026975850597, 0.6464099457789519, 0.659233795393833, 0.6722779677949725, 0.6855462482833217, 0.6990424871939733, 0.7127706010134944, 0.7267345735164552, 0.7409384569214836, 0.7553863730671841, 0.7700825146082573, 0.7850311462321697, 0.8002366058967282, 0.8157033060889165, 0.8314357351053583, 0.8474384583547816, 0.8637161196828563, 0.8802734427197999, 0.8971152322511297, 0.9142463756119691, 0.9316718441053086, 0.9493966944446302, 0.967426070221325, 0.9857652033973123, 1.0044194158233104, 1.0233941207831865, 1.0426948245648473, 1.0623271280581106, 1.0822967283800338, 1.1026094205281654, 1.123271099062202, 1.1442877598145356, 1.1656655016301902, 1.1874105281366498, 1.2095291495440987, 1.2320277844765837, 1.2549129618346435, 1.2781913226899344, 1.301869622212411, 1.3259547316306148, 1.3504536402256437, 1.3753734573593766, 1.4007214145375446, 1.4265048675082534, 1.452731298396551, 1.479408317875675, 1.5065436673755972, 1.5341452213295221, 1.5622209894589738, 1.5907791190981435, 1.6198278975581735, 1.64937575453206, 1.6794312645408747, 1.7100031494220123, 1.741100280860187, 1.7727316829619193, 1.8049065348742475, 1.8376341734484336, 1.8709240959494338, 1.9047859628119177, 1.9392296004436411, 1.9742650040769787, 2.009902340669452, 2.046151951854086, 2.08302435694046, 2.1205302559673167, 2.1586805328076144, 2.197486258326929, 2.23695869359612, 2.2771092931591923, 2.3179497083573013, 2.359491790709862, 2.4017475953537595, 2.4447293845416382, 2.4884496312002966, 2.532921022550214, 2.5781564637872756, 2.6241690818277386, 2.6709722291175444, 2.718579487507076, 2.767004672192495, 2.8162618357247795, 2.866365272087653, 2.917329520845566, 2.969169371362943, 3.0218998670959314, 3.0755363099578696, 3.1300942647597676, 3.185589563727067, 3.2420383110940216, 3.2994568877769925, 3.357861956128044, 3.4172704647702066, 3.477699653515815, 3.539167058369346, 3.601690516616216, 3.6652881719989803, 3.7299784799825035, 3.7957802131095586, 3.862712466448453, 3.9307946631342383, 4.000046560005139, 4.0704882533357996, 4.142140184669048, 4.215023146747839, 4.289158289549128, 4.3645671264214005, 4.441271540327649, 4.519293790195618, 4.59865651737713, 4.679382752218419, 4.761495920743314, 4.845019851451269, 4.929978782232173, 5.016397367399968, 5.104300684847108, 5.193714243321942, 5.284663989831105, 5.377176317169131, 5.47127807157738, 5.566996560534587, 5.664359560681246, 5.763395325880133, 5.864132595415326, 5.966600602332085, 6.070829081920021, 6.176848280341998, 6.28468896341131, 6.39438242551963, 6.50596049871837, 6.619455561956039, 6.73490055047435, 6.852328965365688, 6.97177488329486, 7.093272966387824, 7.216858472290319, 7.3425672643993245, 7.47043582227028, 7.60050125220314, 7.732801298010282, 7.867374351969393, 8.00425946596461, 8.143496362818988, 8.285125447821718, 8.429187820453368, 8.575725286312592, 8.72478036924773, 8.87639632369685, 9.030617147239775, 9.187487593365814, 9.347053184460803, 9.509360225017288, 9.674455815071676, 9.842387863872242, 10.01320510378195, 10.186957104420154, 10.36369428704726, 10.543467939196482, 10.726330229557062, 10.912334223113165, 11.101533896542803, 11.29398415388141, 11.489740842454509, 11.688860769084071, 11.89140171657338, 12.097422460475022, 12.306982786147083, 12.520143506102288, 12.736966477655244, 12.957514620872875, 13.181851936833255, 13.410043526198152, 13.642155608104643, 13.878255539381314, 14.118411834094582, 14.362694183430897, 14.611173475920467, 14.863921818008476, 15.121012554979721, 15.382520292242752, 15.648520916979686, 15.919091620168007, 16.19431091898061, 16.474258679570877, 16.759016140249056, 17.0486659350569, 17.3432921177473, 17.642980186175958, 17.94781710711205, 18.25789134147526, 18.573292870006238, 18.89411321937831, 19.220445488757615, 19.55238437681968, 19.89002620923009, 20.233468966597385, 20.582812312906057, 20.938157624438208, 21.29960801919202, 21.667268386805596, 22.04124541899511, 22.421647640515687, 22.80858544065433, 23.202171105263904, 23.602518849347458, 24.009744850202395, 24.423967281134104, 24.84530634574869, 25.273884312835094, 25.709825551846333, 26.153256568990372, 26.604306043941133, 27.06310486718012, 27.52978617797969, 28.004485403038895, 28.487340295782943, 28.978490976338204, 29.47807997219367, 29.986252259561155, 30.503155305446143, 31.028939110441303, 31.56375625225536, 32.107761929989756, 32.66111400917603, 33.223973067586904, 33.7965024418346, 34.3788682747696, 34.97123956369383, 35.573788209402075, 36.18668906606612, 36.81011999197582, 37.44426190115194, 38.08929881584582, 38.74541791994093, 39.412809613271946, 40.09166756687708, 40.78218877919968, 41.48457363325532, 42.19902595478125, 42.92575307138468, 43.6649658727075, 44.41687887162433, 45.18171026649249, 45.95968200447102, 46.751019845927786, 47.55595342995309, 48.37471634099886, 49.20754617666276, 50.05468461663689, 50.916377492840894, 51.79287486076039, 52.68443107201071, 53.59130484814737, 54.513759355744824, 55.45206228276502, 56.40648591623795, 57.37730722127702, 58.364807921451586, 59.36927458054087, 60.390998685692026, 61.43027673200709, 62.48741030858318, 63.56270618603095, 64.65647640549665, 65.76903836921358, 66.90071493260949, 68.05183449799608, 69.22273110986866, 70.41374455184256, 71.62522044525564, 72.85751034946405, 74.11097186386182, 75.38596873165298, 76.68287094540652, 78.00205485442467, 79.34390327395651, 80.70880559628715, 82.09715790373593, 83.50936308359604, 84.94583094504861, 86.40697833808575, 87.89322927447655, 89.40501505081168, 90.94277437366131, 92.50695348688434, 94.09800630112402, 95.71639452552876, 97.36258780173594, 99.03706384015777, 100.74030855860843, 102.47281622331315, 104.23508959233942, 106.02764006149346, 107.85098781272218, 109.7056619650655, 111.59220072820182, 113.51115155863158, 115.46307131854435, 117.44852643741508, 119.46809307637665, 121.522357295417, 123.61191522344821, 125.73737323129774, 127.8993481076718, 130.09846723814172, 132.33536878720602, 134.61070188347935, 136.92512680806428, 139.27931518615833, 141.67395018195424, 144.10972669688755, 146.58735157129087, 149.1075437895126, 151.67103468855956, 154.27856817032452, 156.9309009174598, 159.6288026129594, 162.3730561635146, 165.16445792670606, 168.00381794209974, 170.89196016631286, 173.82972271211892, 176.81795809166022, 179.8575334638395, 182.949330885961, 186.09424756969622, 189.2931961414464, 192.5471049071783, 195.85691812181017, 199.22359626322637, 202.64811631099897, 206.1314720298986, 209.67467425827604, 213.27875120139794, 216.94474872982343, 220.67373068290578, 224.46677917750912, 228.32499492202896, 232.24949753580788, 236.24142587403878, 240.30193835825068, 244.43221331247125, 248.6334493051677, 252.90686549705848, 257.2537019949038, 261.6752202113732, 266.1727032310959, 270.7474561830008, 275.4008066190526, 280.1341048994959, 284.94872458471673, 289.84606283383835, 294.82754081016355, 299.89460409358406, 305.04872310007306, 310.29139350838966, 315.6241366941075, 321.0485001711084, 326.56605804065254, 332.1784114481728, 337.88718904790835, 343.6940474755298, 349.6006718288759, 355.6087761569554, 361.72010395735003, 367.93642868216017, 374.25955425264306, 380.6913155826988, 387.23357911134036, 393.888243344323, 400.65723940506854, 407.5425315950619, 414.546117963876, 421.6700308889824, 428.9163376655351, 436.28714110627436, 443.7845801517508, 451.41083049101957, 459.1681051930127, 467.05865534874584, 475.0847707245666, 483.24878042662726, 491.55305357676366, 500.0000000000003])
            var comparision_y = Application_Utilities.Equals(y_vector, [0, 1.0017209199420847, 1.003477265489199, 1.0052698680030105, 1.0070995819408881, 1.0089672856199645, 1.010873882010631, 1.0128202995607483, 1.0148074930519135, 1.0168364444892, 1.0189081640258453, 1.0210236909244363, 1.023184094556225, 1.0253904754402758, 1.0276439663242434, 1.0299457333086557, 1.032296977016682, 1.034698933811462, 1.0371528770631695, 1.0396601184681051, 1.0422220094222219, 1.0448399424516142, 1.0475153527026244, 1.050249719494369, 1.053044567936616, 1.0559014706161167, 1.058822049354632, 1.0618079770420925, 1.0648609795484858, 1.0679828377182705, 1.0711753894513132, 1.074440531874559, 1.0777802236088652, 1.0811964871356803, 1.0846914112684811, 1.0882671537341757, 1.0919259438699307, 1.0956700854412118, 1.099501959587121, 1.1034240278994576, 1.10743883564229, 1.1115490151191956, 1.1157572891957312, 1.1200664749851135, 1.1244794877055482, 1.1289993447181128, 1.1336291697546126, 1.1383721973453602, 1.1432317774573983, 1.1482113803542955, 1.1533146016892777, 1.158545167844151, 1.1639069415271788, 1.1694039276438655, 1.175040279455391, 1.180820305040336, 1.186748474076229, 1.1928294249584588, 1.1990679722751054, 1.2054691146573793, 1.2120380430265136, 1.2187801492592247, 1.225701035295171, 1.2328065227112757, 1.2401026627892757, 1.2475957471044588, 1.255292318665274, 1.2631991836353047, 1.2713234236710254, 1.2796724089108293, 1.2882538116529985, 1.297075620762621, 1.30614615684993, 1.3154740882651994, 1.3250684479581178, 1.3349386512525736, 1.3450945145909399, 1.3555462753053658, 1.3663046124771525, 1.3773806689491386, 1.3887860745600928, 1.4005329706744436, 1.4126340360852698, 1.4251025143733957, 1.4379522428106022, 1.4511976829005087, 1.4648539526565287, 1.478936860722531, 1.493462942448406, 1.5084494980397511, 1.5239146329082591, 1.5398773003572297, 1.5563573467448886, 1.573375559276933, 1.5909537165889143, 1.6091146422888085, 1.6278822616402613, 1.6472816615777637, 1.6673391542562042, 1.6880823443489887, 1.7095402003211617, 1.7317431299167048, 1.7547230601123922, 1.778513521804232, 1.8031497395065759, 1.8286687263583299, 1.855109384745359, 1.8825126128629437, 1.9109214175569673, 1.9403810337971974, 1.9709390511504, 2.0026455476348604, 2.0355532313508506, 2.0697175902934575, 2.105197050764405, 2.1420531448078153, 2.1803506871003275, 2.2201579617285456, 2.261546919284866, 2.3045933847062057, 2.3493772762673415, 2.395982836120591, 2.4444988727447154, 2.4950190156268275, 2.547641982449407, 2.6024718589884324, 2.659618391845264, 2.7191972940314955, 2.781330563299082, 2.8461468129540317, 2.9137816147061635, 2.9843778528854874, 3.058086089091878, 3.1350649360328435, 3.215481438937862, 3.299511462509167, 3.3873400808701413, 3.4791619673945715, 3.5751817806337907, 3.675614541793692, 3.7806859983393304, 3.8906329673113067, 4.00570365081311, 4.1261579148636995, 4.252267521393789, 4.384316301590746, 4.522600257060554, 4.667427573373174, 4.819118528494298, 4.978005276390517, 5.144431483745075, 5.318751795265951, 5.501331100550008, 5.692543572944056, 5.892771448395339, 6.102403510011346, 6.32183324208073, 6.551456615802992, 6.791669468127108, 7.0428644351380445, 7.305427402619247, 7.5797334390627285, 7.866142180827738, 8.164992645722085, 8.476597460367486, 8.801236498670033, 9.13914994388053, 9.490530805358393, 9.855516943402833, 10.234182681383494, 10.62653011368413, 11.032480250181354, 11.451864172320935, 11.88441441114627, 12.32975679230315, 12.787403025094106, 13.256744339726946, 13.737046496297097, 14.22744649793063, 14.726951336031545, 15.234439075151338, 15.748662546577064, 16.26825586212668, 16.79174388282437, 17.317554682480186, 17.84403493670227, 18.369468048108327, 18.892094694567056, 19.410135366436656, 19.92181434888656, 20.425384514458372, 20.919152226253953, 21.401501619340955, 21.870917530837445, 22.32600638880887, 22.765514444948813, 23.18834284167387, 23.59355913404209, 23.98040503242851, 24.34830028376265, 24.69684275798587, 25.02580494349583, 25.335127173517105, 25.624907999258344, 25.895392192295585, 26.146956896977333, 26.380096464862508, 26.595406490094998, 26.79356753106544, 26.97532895446435, 27.14149327768182, 27.292901319242347, 27.430418398830426, 27.5549217619903, 27.66728934260803, 27.76838992077909, 27.859074685822687, 27.9401701746271, 28.01247252420267, 28.076742953815337, 28.13370437579259, 28.184039024010595, 28.228386984341288, 28.267345510911525, 28.30146901498101, 28.331269618763205, 28.357218173763815, 28.37974565168519, 28.39924482494332, 28.41607216313108, 28.430549880884765, 28.44296808138583, 28.45358694800034, 28.462638944197938, 28.47033098886454, 28.47684658035856, 28.482347848260112, 28.486977516616314, 28.490860766766893, 28.49410699148443, 28.496811435282947, 28.499056718390033, 28.500914244043887, 28.502445490592518, 28.503703191303924, 28.504732405937418, 28.50557148900023, 28.506252960258607, 28.506804283502817, 28.507248559838928, 28.507605141916013, 28.5078901754826, 28.50811707458947, 28.508296936567362, 28.508438902670182, 28.50855046999051, 28.508637759914105, 28.508705748051028, 28.50875846018627, 28.508799138454393, 28.508830381545742, 28.508854262405478, 28.50887242652692, 28.50888617361812, 28.50889652508755, 28.508904279521737, 28.508910058043792, 28.508914341187293, 28.508917498722106, 28.508919813623688, 28.50892150124395, 19.727220208324486, 15.261922675994287, 15.261653381785639, 15.261653363937208, 15.261653363936249, 15.26165336393625, 15.26165336393622, 15.261653363936242, 15.261653363936198, 15.261653363936155, 15.261653363936224, 15.261653363936272, 15.261653363936272, 15.261653363936292, 15.261653363936194, 15.261653363936192, 15.261653363936185, 15.261653363936196, 15.261653363936189, 15.261653363936237, 15.261653363936247, 15.261653363936157, 15.261653363936212, 15.261653363936244, 15.261653363936274, 15.261653363936245, 15.261653363936192, 15.261653363936242, 15.261653363936238, 15.26165336393621, 15.261653363936235, 15.26165336393618, 15.261653363936217, 15.261653363936171, 15.261653363936222, 15.261653363936206, 15.26165336393621, 15.261653363936233, 15.261653363936235, 15.26165336393622, 15.26165336393616, 15.261653363936272, 15.261653363936258, 15.261653363936274, 15.261653363936347, 15.261653363936313, 15.261653363936263, 15.261653363936386, 15.261653363936247, 15.261653363936267, 15.261653363936231, 15.261653363936158, 15.26165336393629, 15.261653363936283, 15.261653363936237, 15.261653363936313, 15.26165336393632, 15.261653363936249, 15.261653363936356, 15.261653363936325, 15.261653363936249, 15.261653363936189, 15.261653363936267, 15.261653363936373, 15.261653363936224, 15.261653363936325, 15.261653363936315, 15.261653363936222, 15.261653363936148, 15.261653363936311, 15.261653363936208, 15.261653363936258, 15.261653363936402, 15.261653363936146, 15.261653363936185, 15.261653363936249, 15.261653363936471, 15.261653363936386, 15.261653363936237, 15.261653363936087, 15.261653363936425, 15.261653363936325, 15.261653363936093, 15.261653363936606, 15.26165336393623, 15.26165336393672, 15.261653363936308, 15.26165336393643, 15.261653363936682, 15.261653363936643, 15.261653363936025, 15.261653363936786, 15.261653363936478, 15.261653363936107, 16.022924077391483, 24.997057334746298, 27.8308781328805, 28.39272600266039, 28.489936257709335, 28.50592645220786, 28.508467018089853, 28.50885780387273, 28.508915993477775, 28.508924377304552, 28.508925545430262, 28.508925702734047, 28.508925723195446, 28.50892572576446, 28.508925726075667, 28.508925726111745, 28.508925726115702, 28.508925726115777, 28.508925726115578, 28.508925726115407, 28.50892572611522, 28.50892572611494, 28.508925726114544, 28.50892572611414, 28.508925726113745, 28.508925726113556, 28.50892572611313, 28.508925726112622, 28.508925726112096, 28.50892572611158, 28.50892572611108, 28.50892572611066, 28.508925726109908, 28.50892572610943, 28.508925726108963, 28.508925726107943, 28.50892572610745, 28.508925726106646, 28.50892572610533, 28.50892572610466, 28.508925726103577, 28.508925726102394, 28.50892572610102, 28.50892572610007, 28.508925726098354, 28.508925726097118, 28.50892572609542, 28.508925726093388, 28.50892572609141, 28.508925726088943, 28.50892572608646, 28.508925726083834, 28.50892572608172, 28.50892572607895, 28.508925726075326, 28.50892572607106, 28.508925726066515, 28.508925726062976, 28.508925726058234, 28.508925726053135, 28.50892572604704, 28.508925726040133, 28.50892572603131, 28.508925726023314, 28.50892572601612, 28.508925726007057, 28.508925725995237, 28.50892572598347, 28.508925725966417, 28.508925725951514, 28.508925725935942, 28.50892572591171, 28.508925725892176, 28.508925725871496, 28.508925725845426, 28.50892572581381, 28.508925725773004, 28.508925725730705, 28.50892572569165, 28.50892572562231, 28.508925725569508, 28.508925725491732, 28.50892572541196, 28.508925725322985, 28.508925725225456, 28.508925725088613, 28.50892572495366, 28.508925724796512, 28.50892572463473, 28.508925724416933, 28.5089257241337, 28.508925723887845, 28.508925723461857, 28.508925723081973, 28.508925722633563, 28.50892572210175, 28.508925721361013, 28.50892572054764, 28.508925719707666, 28.508925718636434, 28.508925717266607, 28.508925715663857, 28.508925713632003, 28.508925711002416, 28.50892570866971, 28.508925704801666, 28.50892570040744, 28.508925696193554, 28.508925689143613, 28.50892568251866, 28.508925672838416, 28.50892565975811, 28.508925646424814, 28.508925626784073, 28.508925606232406, 28.508925574701273, 28.508925541509804, 28.50892549939774, 28.508925441122546, 28.508925369613333, 28.508925266848422, 28.508925150119275, 28.50892499283241, 28.50892481631117, 28.50892452851673, 28.50892418915271, 28.50892377026999, 28.508923193333004, 28.50892244969412, 28.50892136047362, 28.508919975365366, 28.508918380565227, 28.50891589889602, 28.508912468220405, 28.508908083966094, 28.508901940928798])

            assert.equal(true, comparision_x && comparision_y);
        });
    });
});