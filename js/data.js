// ===== DATA SOAL GABUNGAN =====
const TOPICS = {
  3: [
    {
      id:'food', name:'Food & Drink', icon:'🍔', color:'#FF6B35',
      questions:[
        { type:'mc', q:'What is this food called in English?', img:'🍎', choices:['Apple','Banana','Mango','Orange'], answer:0, exp:'"Apple" = buah apel.' },
        { type:'mc', q:'Which one is a DRINK?', img:null, choices:['🍚 Rice','🥛 Milk','🍞 Bread','🥕 Carrot'], answer:1, exp:'"Milk" (susu) adalah minuman.' },
        { type:'fill', q:'Pilih kata yang tepat untuk melengkapi kalimat!', sentence:'I eat _____ for breakfast.', bank:['rice','sleep','book','car'], answer:'rice', exp:'"Rice" = nasi. Kita makan nasi untuk sarapan.' },
        { type:'drag', q:'Pasangkan gambar makanan/minuman ke kategorinya!', items:[{id:'a',label:'🍎 Apple', zone:'fruit'},{id:'b',label:'🥛 Milk', zone:'drink'},{id:'c',label:'🍊 Orange', zone:'fruit'},{id:'d',label:'🧃 Juice', zone:'drink'}], zones:[{id:'fruit', label:'🍏 Fruit'},{id:'drink', label:'🥤 Drink'}], exp:'Apple & Orange = fruit. Milk & Juice = drink.' },
        { type:'mc', q:'What is "jeruk" in English?', img:'🍊', choices:['Lemon','Orange','Grape','Lime'], answer:1, exp:'"Orange" = jeruk.' },
        { type:'voice', q:'Say this sentence out loud!', target:'I like apple juice', exp:'"I like apple juice" = Saya suka jus apel.' },
        { type:'fill', q:'Isi titik-titik!', sentence:'She drinks _____ every morning.', bank:['milk','stone','chair','window'], answer:'milk', exp:'"Milk" = susu. Diminum setiap pagi.' },
        { type:'drag', q:'Kelompokkan makanan & minuman!', items:[{id:'a',label:'🍗 Chicken', zone:'food'},{id:'b',label:'💧 Water', zone:'drink'},{id:'c',label:'🍞 Bread', zone:'food'},{id:'d',label:'🧋 Tea', zone:'drink'}], zones:[{id:'food', label:'🍽️ Food'},{id:'drink', label:'🥤 Drink'}], exp:'Chicken & Bread = food. Water & Tea = drink.' },
        { type:'mc', q:'What is "ayam goreng" in English?', img:'🍗', choices:['Grilled Fish','Fried Chicken','Boiled Egg','Steamed Shrimp'], answer:1, exp:'"Fried Chicken" = ayam goreng.' },
        { type:'voice', q:'Baca kalimat ini dengan suara keras!', target:'I drink milk every day', exp:'"I drink milk every day" = Saya minum susu setiap hari.' }
      ]
    },
    {
      id:'activity', name:'Daily Activity', icon:'🏃', color:'#4ECDC4',
      questions:[
        { type:'mc', q:'What is the boy doing?', img:'📚', choices:['He is eating','He is reading','He is sleeping','He is playing'], answer:1, exp:'"He is reading" = Dia sedang membaca.' },
        { type:'fill', q:'Lengkapi kalimat!', sentence:'I _____ my teeth every morning.', bank:['brush','eat','drink','sleep'], answer:'brush', exp:'"Brush my teeth" = menggosok gigi.' },
        { type:'drag', q:'Urutkan kegiatan harian ke waktu yang benar!', items:[{id:'a',label:'🌅 Wake up', zone:'morning'},{id:'b',label:'🍳 Breakfast', zone:'morning'},{id:'c',label:'🌙 Sleep', zone:'night'},{id:'d',label:'📚 Study', zone:'afternoon'}], zones:[{id:'morning', label:'🌞 Morning'},{id:'afternoon', label:'☀️ Afternoon'},{id:'night', label:'🌙 Night'}], exp:'Wake up & Breakfast = morning. Study = afternoon. Sleep = night.' },
        { type:'voice', q:'Ucapkan kalimat ini dengan jelas!', target:'I go to school every day', exp:'"I go to school every day" = Saya pergi ke sekolah setiap hari.' },
        { type:'mc', q:'What does "mandi" mean?', img:'🚿', choices:['Sleep','Take a bath','Cook','Read'], answer:1, exp:'"Take a bath" = mandi.' },
        { type:'fill', q:'Isi dengan kata yang benar!', sentence:'Mother _____ dinner in the kitchen.', bank:['cooks','sleeps','reads','runs'], answer:'cooks', exp:'"Cooks dinner" = memasak makan malam.' },
        { type:'match', q:'Pasangkan kegiatan dengan waktunya!', pairs:[{left:'Wake up', right:'Morning'},{left:'Lunch', right:'Noon'},{left:'Dinner', right:'Evening'},{left:'Sleep', right:'Night'}], exp:'Wake up = Morning, Lunch = Noon, Dinner = Evening, Sleep = Night.' },
        { type:'mc', q:'After school, I _____ my homework.', img:null, choices:['do','drink','play','sleep'], answer:0, exp:'"Do homework" = mengerjakan PR.' }
      ]
    },
    {
      id:'preposition', name:'Prepositions', icon:'📦', color:'#9B59B6',
      questions:[
        { type:'mc', q:'The cat is _____ the box.', img:'📦', choices:['in','on','under','behind'], answer:0, exp:'"In" = di dalam. Kucing di dalam kotak.' },
        { type:'mc', q:'The book is _____ the table.', img:'📚', choices:['in','on','under','next to'], answer:1, exp:'"On" = di atas permukaan.' },
        { type:'drag', q:'Letakkan benda di posisi yang benar!', items:[{id:'a',label:'🐱 Cat', zone:'in'},{id:'b',label:'📕 Book', zone:'on'},{id:'c',label:'👟 Shoe', zone:'under'},{id:'d',label:'🪴 Plant', zone:'next_to'}], zones:[{id:'in', label:'📦 IN the box'},{id:'on', label:'🪑 ON the table'},{id:'under', label:'🛏️ UNDER the bed'},{id:'next_to', label:'🚪 NEXT TO the door'}], exp:'Cat = in, Book = on, Shoe = under, Plant = next to.' },
        { type:'fill', q:'Pilih preposisi yang tepat!', sentence:'The pencil is _____ the bag.', bank:['in','over','behind','above'], answer:'in', exp:'"In" = di dalam. Pensil di dalam tas.' },
        { type:'voice', q:'Baca kalimat ini!', target:'The cat is under the table', exp:'"The cat is under the table" = Kucing di bawah meja.' },
        { type:'mc', q:'The ball is _____ the two chairs.', img:'⚽', choices:['in','on','between','above'], answer:2, exp:'"Between" = di antara dua benda.' },
        { type:'match', q:'Pasangkan preposisi dengan artinya!', pairs:[{left:'in', right:'di dalam'},{left:'on', right:'di atas'},{left:'under', right:'di bawah'},{left:'next to', right:'di sebelah'}], exp:'in=dalam, on=atas, under=bawah, next to=sebelah.' },
        { type:'fill', q:'Lengkapi!', sentence:'There is a bird _____ the tree.', bank:['on','in','under','behind'], answer:'on', exp:'"On the tree" = bertengger di pohon.' }
      ]
    },
    {
      id: 'kelas3_full', name: 'Bank Soal Kelas 3 (20 Soal)', icon: '📚', color: '#FF6B35',
      questions: [
        { type:'mc', q:'Dani: "Hello, my name is Dani. What is your name?" Siti: "Hi! ______ name is Siti."', img:'👋', choices:['Her','My','Your','His'], answer:1, exp:'Kata ganti kepemilikan untuk subjek saya (I) adalah My (My name is...).' },
        { type:'mc', q:'Look at the picture! We use our ______ to see the beautiful rainbow.', img:'👁️', choices:['Ears','Nose','Eyes','Mouth'], answer:2, exp:'Eyes artinya mata; organ tubuh yang digunakan untuk melihat (see).' },
        { type:'mc', q:'An elephant is very big, but a mouse is very ______.', img:'🐘', choices:['Small','Tall','Long','Heavy'], answer:0, exp:'Lawan kata (antonim) dari besar (big) adalah kecil (small).' },
        { type:'mc', q:'What is the English word for "Apel"?', img:'🍎', choices:['Apple','Banana','Orange','Mango'], answer:0, exp:'Apple adalah bahasa Inggris dari buah apel.' },
        { type:'mc', q:'My father has a father. He is my ______.', img:'👴', choices:['Uncle','Brother','Grandfather','Father'], answer:2, exp:'Ayah dari ayah kita adalah kakek (grandfather).' },
        { type:'mc', q:'Red plus yellow makes ______.', img:'🎨', choices:['Green','Orange','Purple','Pink'], answer:1, exp:'Pencampuran warna merah dan kuning menghasilkan warna jingga/oranye (orange).' },
        { type:'mc', q:'How many days are there in a week?', img:'📅', choices:['Five','Six','Seven','Eight'], answer:2, exp:'Dalam satu minggu terdapat 7 hari (seven days).' },
        { type:'mc', q:'We use a ______ to write on our notebook.', img:'️', choices:['Ruler','Eraser','Pencil','Bag'], answer:2, exp:'Kita menggunakan pensil (pencil) untuk menulis di buku catatan.' },
        { type:'mc', q:'The color of the sky on a sunny day is ______.', img:'🌤️', choices:['Red','Green','Blue','Black'], answer:2, exp:'Warna langit yang cerah adalah biru (blue).' },
        { type:'mc', q:'This animal likes to eat bananas and can climb trees. It is a ______.', img:'🐒', choices:['Cat','Monkey','Dog','Fish'], answer:1, exp:'Hewan yang suka makan pisang dan memanjat pohon adalah monyet (monkey).' },
        { type:'mc', q:'Good ______! (Selamat pagi!)', img:'🌅', choices:['Morning','Afternoon','Evening','Night'], answer:0, exp:'Selamat pagi dalam bahasa Inggris adalah Good morning.' },
        { type:'mc', q:'I have ten ______. I use them for walking.', img:'', choices:['Fingers','Toes','Eyes','Ears'], answer:1, exp:'Toes artinya jari kaki; bagian tubuh yang digunakan untuk berjalan.' },
        { type:'mc', q:'What is the English word for "Kucing"?', img:'', choices:['Cow','Bird','Cat','Duck'], answer:2, exp:'Cat adalah bahasa Inggris dari kucing.' },
        { type:'mc', q:'A: "How are you today?" B: "I am ______, thank you."', img:'😊', choices:['Sad','Fine','Angry','Hungry'], answer:1, exp:'Fine artinya baik-baik saja; jawaban umum untuk menanyakan kabar.' },
        { type:'mc', q:'Before number ten is number ______.', img:'🔢', choices:['Eight','Nine','Eleven','Twelve'], answer:1, exp:'Sebelum angka sepuluh (ten) adalah angka sembilan (nine).' },
        { type:'mc', q:'My mother is cooking in the ______.', img:'', choices:['Bedroom','Bathroom','Kitchen','Living room'], answer:2, exp:'Ibu memasak di dapur (kitchen).' },
        { type:'mc', q:'A ______ drives an airplane.', img:'✈️', choices:['Driver','Pilot','Doctor','Teacher'], answer:1, exp:'Orang yang mengemudikan pesawat terbang adalah pilot.' },
        { type:'mc', q:'The Indonesian meaning of "Thank you" is ______.', img:'', choices:['Halo','Selamat tinggal','Terima kasih','Maaf'], answer:2, exp:'Thank you artinya terima kasih.' },
        { type:'mc', q:'Ice cream tastes ______.', img:'', choices:['Bitter','Sour','Sweet','Salty'], answer:2, exp:'Es krim rasanya manis (sweet).' },
        { type:'mc', q:'A ______ makes furniture from wood.', img:'🔨', choices:['Carpenter','Barber','Chef','Farmer'], answer:0, exp:'Tukang kayu (carpenter) membuat perabot dari kayu.' }
      ]
    }
  ],
  4: [
    {
      id:'transportation', name:'Transportation', icon:'🚌', color:'#3498DB',
      questions:[
        { type:'mc', q:'What do you call "pesawat" in English?', img:'✈️', choices:['Ship','Airplane','Train','Bus'], answer:1, exp:'"Airplane" = pesawat terbang.' },
        { type:'drag', q:'Kelompokkan kendaraan berdasarkan jalurnya!', items:[{id:'a',label:'✈️ Airplane', zone:'air'},{id:'b',label:'🚢 Ship', zone:'water'},{id:'c',label:'🚂 Train', zone:'land'},{id:'d',label:'🚁 Helicopter',zone:'air'},{id:'e',label:'⛵ Boat', zone:'water'},{id:'f',label:'🚗 Car', zone:'land'}], zones:[{id:'air', label:'🌤️ Air'},{id:'water', label:'🌊 Water'},{id:'land', label:'🛣️ Land'}], exp:'Air: Airplane, Helicopter. Water: Ship, Boat. Land: Train, Car.' },
        { type:'fill', q:'Lengkapi kalimat!', sentence:'The _____ runs on a railway track.', bank:['train','bus','car','ship'], answer:'train', exp:'"Train" = kereta, berjalan di atas rel.' },
        { type:'voice', q:'Ucapkan nama kendaraan ini!', target:'I go to school by bus', exp:'"I go to school by bus" = Saya pergi ke sekolah naik bus.' },
        { type:'mc', q:'Which transportation travels on water?', img:'🌊', choices:['Car','Train','Ship','Bicycle'], answer:2, exp:'"Ship" = kapal, transportasi di air.' },
        { type:'match', q:'Pasangkan kendaraan dengan bahasa Indonesianya!', pairs:[{left:'Airplane', right:'Pesawat'},{left:'Train', right:'Kereta'},{left:'Ship', right:'Kapal'},{left:'Bicycle', right:'Sepeda'}], exp:'Airplane=Pesawat, Train=Kereta, Ship=Kapal, Bicycle=Sepeda.' },
        { type:'fill', q:'Isi titik-titik!', sentence:'We flew to Bali by _____.', bank:['airplane','bus','car','bicycle'], answer:'airplane', exp:'"Flew" = terbang. Ke Bali naik pesawat.' },
        { type:'drag', q:'Urutkan kecepatan kendaraan dari paling lambat!', items:[{id:'a',label:'🚲 Bicycle', zone:'slow'},{id:'b',label:'🚗 Car', zone:'medium'},{id:'c',label:'✈️ Airplane', zone:'fast'}], zones:[{id:'slow', label:'🐢 Slowest'},{id:'medium', label:'🐕 Medium'},{id:'fast', label:'🐆 Fastest'}], exp:'Bicycle = slowest, Car = medium, Airplane = fastest.' },
        { type:'mc', q:'What do you call "ambulans"?', img:'🚑', choices:['Fire Truck','Police Car','Ambulance','Taxi'], answer:2, exp:'"Ambulance" = ambulans, kendaraan darurat medis.' }
      ]
    },
    {
      id:'time', name:'Telling Time', icon:'⏰', color:'#E67E22',
      questions:[
        { type:'mc', q:'How do you say "pukul 7 pagi"?', img:'🌅', choices:["7 in the evening","7 o'clock in the morning","7 at night","7 in the afternoon"], answer:1, exp:'"7 o\'clock in the morning" = pukul 7 pagi.' },
        { type:'drag', q:'Kelompokkan waktu ke bagian harinya!', items:[{id:'a',label:'☀️ 7 AM', zone:'morning'},{id:'b',label:'🌞 12 PM', zone:'noon'},{id:'c',label:'🌆 6 PM', zone:'evening'},{id:'d',label:'🌙 10 PM', zone:'night'}], zones:[{id:'morning', label:'🌅 Morning'},{id:'noon', label:'☀️ Noon'},{id:'evening', label:'🌇 Evening'},{id:'night', label:'🌙 Night'}], exp:'7AM=Morning, 12PM=Noon, 6PM=Evening, 10PM=Night.' },
        { type:'fill', q:'Lengkapi kalimat!', sentence:'School starts at 7 o\'clock in the _____.', bank:['morning','evening','night','midnight'], answer:'morning', exp:'Sekolah mulai pukul 7 pagi (morning).' },
        { type:'voice', q:'Ucapkan kalimat ini!', target:'What time is it now', exp:'"What time is it now?" = Jam berapa sekarang?' },
        { type:'mc', q:'When is "tengah hari"?', img:'☀️', choices:['Midnight','Noon','Dawn','Dusk'], answer:1, exp:'"Noon" = tengah hari = pukul 12 siang.' },
        { type:'match', q:'Pasangkan!', pairs:[{left:'Morning', right:'Pagi'},{left:'Noon', right:'Siang'},{left:'Evening', right:'Sore'},{left:'Midnight', right:'Tengah malam'}], exp:'Morning=Pagi, Noon=Siang, Evening=Sore, Midnight=Tengah malam.' },
        { type:'fill', q:'Isi!', sentence:'We have lunch at _____ past twelve.', bank:['half','quarter','full','double'], answer:'half', exp:'"Half past twelve" = 12:30.' },
        { type:'mc', q:'What does "quarter past 3" mean?', img:null, choices:['3:45','3:15','3:30','2:45'], answer:1, exp:'"Quarter past 3" = 3:15. Quarter = 15 menit.' }
      ]
    },
    {
      id:'daily', name:'Daily Schedule', icon:'📅', color:'#2ECC71',
      questions:[
        { type:'drag', q:'Urutkan kegiatan harian ini dari pagi ke malam!', items:[{id:'a',label:'😴 Wake up', zone:'morning'},{id:'b',label:'🍳 Breakfast', zone:'morning'},{id:'c',label:'🎒 Go to school',zone:'morning'},{id:'d',label:'📚 Study', zone:'afternoon'},{id:'e',label:'🏠 Go home', zone:'afternoon'},{id:'f',label:'🌙 Sleep', zone:'night'}], zones:[{id:'morning', label:'🌅 Morning (AM)'},{id:'afternoon', label:'☀️ Afternoon (PM)'},{id:'night', label:'🌙 Night'}], exp:'Pagi: Wake up, Breakfast, Go to school. Siang: Study, Go home. Malam: Sleep.' },
        { type:'fill', q:'Lengkapi!', sentence:'After waking up, I _____ my face.', bank:['wash','sleep','cook','read'], answer:'wash', exp:'"Wash my face" = mencuci muka.' },
        { type:'voice', q:'Baca dengan keras!', target:'I wake up at six in the morning', exp:'"I wake up at six in the morning" = Saya bangun jam 6 pagi.' },
        { type:'mc', q:'When do you have breakfast?', img:'🍳', choices:['In the morning','At noon','In the evening','At night'], answer:0, exp:'"Breakfast" = sarapan. Dilakukan di pagi hari.' },
        { type:'match', q:'Pasangkan kegiatan dengan waktunya!', pairs:[{left:'Breakfast', right:'Morning'},{left:'Lunch', right:'Noon'},{left:'Homework', right:'Afternoon'},{left:'Sleep', right:'Night'}], exp:'Breakfast=Morning, Lunch=Noon, Homework=Afternoon, Sleep=Night.' },
        { type:'fill', q:'Isi titik-titik!', sentence:'I do my _____ after coming home from school.', bank:['homework','cooking','sleeping','shopping'], answer:'homework', exp:'"Do homework" = mengerjakan PR.' },
        { type:'mc', q:'What is the LAST activity before sleeping?', img:'😴', choices:['Eat breakfast','Go to school','Brush teeth','Play outside'], answer:2, exp:'Sebelum tidur kita menggosok gigi (brush teeth).' },
        { type:'drag', q:'Kelompokkan kegiatan!', items:[{id:'a',label:'🦷 Brush teeth', zone:'hygiene'},{id:'b',label:'🍽️ Eat rice', zone:'eating'},{id:'c',label:'📖 Read book', zone:'study'},{id:'d',label:'🧴 Take a bath', zone:'hygiene'}], zones:[{id:'hygiene', label:'🧼 Hygiene'},{id:'eating', label:'🍽️ Eating'},{id:'study', label:'📚 Study'}], exp:'Hygiene: Brush teeth, Take bath. Eating: Eat rice. Study: Read book.' }
      ]
    },
    {
      id: 'kelas4_full', name: 'Bank Soal Kelas 4 (20 Soal)', icon: '📝', color: '#4ECDC4',
      questions: [
        { type:'mc', q:'Teacher: "Please ______ the door, it is very hot inside." Student: "Yes, Teacher."', img:'🚪', choices:['Close','Open','Clean','Write'], answer:1, exp:'Karena ruangan terasa panas (hot); instruksi yang tepat adalah membuka (open) pintu.' },
        { type:'mc', q:'What is the English word for "papan tulis"?', img:'⬛', choices:['Pencil case','Blackboard','Notebook','Eraser'], answer:1, exp:'Blackboard adalah bahasa Inggris dari papan tulis.' },
        { type:'mc', q:'We can find a pillow and a blanket in the ______.', img:'🛏️', choices:['Kitchen','Garage','Bedroom','Bathroom'], answer:2, exp:'Bantal (pillow) dan selimut (blanket) berada di kamar tidur (bedroom).' },
        { type:'mc', q:'Today is Monday. Yesterday was ______.', img:'📅', choices:['Tuesday','Wednesday','Sunday','Saturday'], answer:2, exp:'Hari ini hari Senin; maka kemarin (yesterday) adalah hari Minggu (Sunday).' },
        { type:'mc', q:'The month after August is ______.', img:'📆', choices:['July','September','October','November'], answer:1, exp:'Bulan setelah Agustus adalah September.' },
        { type:'mc', q:'The shape of a coin is ______.', img:'🪙', choices:['Square','Triangle','Circle','Rectangle'], answer:2, exp:'Bentuk koin adalah lingkaran (circle).' },
        { type:'mc', q:'A horse can ______ very fast.', img:'🐴', choices:['Fly','Swim','Run','Crawl'], answer:2, exp:'Kuda dapat berlari (run) dengan sangat cepat.' },
        { type:'mc', q:'I want to buy some medicine. I should go to the ______.', img:'🏥', choices:['Bakery','Apothecary / Pharmacy','Library','Market'], answer:1, exp:'Tempat untuk membeli obat adalah apotek (apothecary / pharmacy).' },
        { type:'mc', q:'The opposite (lawan kata) of "Happy" is ______.', img:'😊', choices:['Glad','Smile','Sad','Laugh'], answer:2, exp:'Lawan kata dari bahagia (happy) adalah sedih (sad).' },
        { type:'mc', q:'We have breakfast in the ______.', img:'🍳', choices:['Morning','Afternoon','Evening','Night'], answer:0, exp:'Sarapan (breakfast) dilakukan pada pagi hari (morning).' },
        { type:'mc', q:'My sister loves playing music. She plays the ______.', img:'🎸', choices:['Book','Guitar','Ball','Doll'], answer:1, exp:'Alat musik yang dimainkan adalah gitar (guitar).' },
        { type:'mc', q:'What do you say when you make a mistake?', img:'😔', choices:['Good bye','Thank you','I am sorry','You are welcome'], answer:2, exp:'Saat melakukan kesalahan; kita mengucapkan maaf (I am sorry).' },
        { type:'mc', q:'An ant is small but a whale is very ______.', img:'🐋', choices:['Short','Thin','Huge','Weak'], answer:2, exp:'Paus ukurannya sangat besar/raksasa (huge) dibandingkan semut.' },
        { type:'mc', q:'There are ______ months in a year.', img:'📅', choices:['Seven','Ten','Twelve','Twenty'], answer:2, exp:'Dalam satu tahun terdapat dua belas (twelve) bulan.' },
        { type:'mc', q:'A person who cures sick people is a ______.', img:'🏥', choices:['Dentist / Doctor','Policeman','Firefighter','Artist'], answer:0, exp:'Orang yang mengobati orang sakit adalah dokter (doctor).' },
        { type:'mc', q:'The color of a spinach leaf is ______.', img:'🥬', choices:['Red','Yellow','Green','White'], answer:2, exp:'Warna daun bayam adalah hijau (green).' },
        { type:'mc', q:'We use our ______ to listen to music.', img:'👂', choices:['Eyes','Nose','Tongue','Ears'], answer:3, exp:'Kita menggunakan telinga (ears) untuk mendengarkan musik.' },
        { type:'mc', q:'It is raining outside. You should use an ______.', img:'☔', choices:['Hat','Umbrella','Sunglasses','Shoes'], answer:1, exp:'Saat hujan di luar; kita sebaiknya menggunakan payung (umbrella).' },
        { type:'mc', q:'The lion is known as the king of the ______.', img:'🦁', choices:['Jungle','Sea','Sky','River'], answer:0, exp:'Singa dikenal sebagai raja hutan (jungle).' },
        { type:'mc', q:'The Indonesian meaning of "Library" is ______.', img:'', choices:['Laboratorium','Perpustakaan','Kantor','Kelas'], answer:1, exp:'Library artinya perpustakaan.' }
      ]
    }
  ],
  5: [
    {
      id:'animals', name:'Animals', icon:'🦁', color:'#F39C12',
      questions:[
        { type:'mc', q:'What is "gajah" in English?', img:'🐘', choices:['Tiger','Elephant','Giraffe','Hippo'], answer:1, exp:'"Elephant" = gajah.' },
        { type:'drag', q:'Kelompokkan hewan berdasarkan habitatnya!', items:[{id:'a',label:'🦁 Lion', zone:'land'},{id:'b',label:'🐬 Dolphin', zone:'water'},{id:'c',label:'🦅 Eagle', zone:'air'},{id:'d',label:'🐘 Elephant', zone:'land'},{id:'e',label:'🐟 Fish', zone:'water'},{id:'f',label:'🦜 Parrot', zone:'air'}], zones:[{id:'land', label:'🌍 Land'},{id:'water', label:'🌊 Water'},{id:'air', label:'☁️ Air'}], exp:'Land: Lion, Elephant. Water: Dolphin, Fish. Air: Eagle, Parrot.' },
        { type:'fill', q:'Lengkapi!', sentence:'A _____ has a very long neck.', bank:['giraffe','elephant','monkey','lion'], answer:'giraffe', exp:'"Giraffe" = jerapah, punya leher panjang.' },
        { type:'voice', q:'Ucapkan nama hewan ini!', target:'The elephant is the largest land animal', exp:'"The elephant is the largest land animal." = Gajah adalah hewan darat terbesar.' },
        { type:'match', q:'Pasangkan hewan dengan suaranya!', pairs:[{left:'🐄 Cow', right:'Moo'},{left:'🐕 Dog', right:'Bark'},{left:'🐱 Cat', right:'Meow'},{left:'🦁 Lion', right:'Roar'}], exp:'Cow=Moo, Dog=Bark, Cat=Meow, Lion=Roar.' },
        { type:'mc', q:'Which animal is a mammal?', img:null, choices:['Frog 🐸','Snake 🐍','Shark 🦈','Dolphin 🐬'], answer:3, exp:'"Dolphin" = lumba-lumba, mamalia laut.' },
        { type:'drag', q:'Kelompokkan berdasarkan jenis hewan!', items:[{id:'a',label:'🐊 Crocodile', zone:'reptile'},{id:'b',label:'🦋 Butterfly', zone:'insect'},{id:'c',label:'🐍 Snake', zone:'reptile'},{id:'d',label:'🐝 Bee', zone:'insect'}], zones:[{id:'reptile', label:'🦎 Reptile'},{id:'insect', label:'🐛 Insect'}], exp:'Reptile: Crocodile, Snake. Insect: Butterfly, Bee.' },
        { type:'fill', q:'Isi titik-titik!', sentence:'A _____ hops and lives near ponds.', bank:['frog','fish','cat','rabbit'], answer:'frog', exp:'"Frog" = katak. Katak melompat dan hidup di dekat kolam.' },
        { type:'mc', q:'What is "kupu-kupu" in English?', img:'🦋', choices:['Bee','Dragonfly','Butterfly','Moth'], answer:2, exp:'"Butterfly" = kupu-kupu.' },
        { type:'voice', q:'Baca kalimat ini!', target:'I love animals very much', exp:'"I love animals very much" = Saya sangat suka hewan.' }
      ]
    },
    {
      id:'adjective', name:'Adjectives', icon:'🎨', color:'#E91E63',
      questions:[
        { type:'mc', q:'What is the opposite of "big"?', choices:['Tall','Small','Wide','Long'], answer:1, exp:'Antonim "big" (besar) = "small" (kecil).' },
        { type:'drag', q:'Kelompokkan kata sifat!', items:[{id:'a',label:'🔥 Hot', zone:'temp'},{id:'b',label:'🐘 Big', zone:'size'},{id:'c',label:'❄️ Cold', zone:'temp'},{id:'d',label:'🐭 Small', zone:'size'},{id:'e',label:'🔴 Red', zone:'color'},{id:'f',label:'💛 Yellow', zone:'color'}], zones:[{id:'temp', label:'🌡️ Temperature'},{id:'size', label:'📏 Size'},{id:'color', label:'🎨 Color'}], exp:'Temp: Hot,Cold. Size: Big,Small. Color: Red,Yellow.' },
        { type:'fill', q:'Lengkapi dengan kata sifat!', sentence:'The elephant is _____ than the mouse.', bank:['bigger','smaller','faster','lighter'], answer:'bigger', exp:'"Bigger" = lebih besar. Gajah lebih besar dari tikus.' },
        { type:'voice', q:'Ucapkan kalimat berikut!', target:'The sky is very blue and beautiful', exp:'"The sky is very blue and beautiful" = Langit sangat biru dan indah.' },
        { type:'match', q:'Pasangkan kata sifat dengan antonimnya!', pairs:[{left:'Hot', right:'Cold'},{left:'Big', right:'Small'},{left:'Fast', right:'Slow'},{left:'Heavy', right:'Light'}], exp:'Hot↔Cold, Big↔Small, Fast↔Slow, Heavy↔Light.' },
        { type:'mc', q:'What adjective describes the sky during the day?', img:'☀️', choices:['Black','Blue','Green','Yellow'], answer:1, exp:'Langit berwarna biru (blue) pada siang hari.' },
        { type:'fill', q:'Isi!', sentence:'My bag is _____ because I have many books.', bank:['heavy','light','fast','loud'], answer:'heavy', exp:'"Heavy" = berat. Banyak buku membuat tas berat.' },
        { type:'drag', q:'Urutkan dari kecil ke besar!', items:[{id:'a',label:'🐭 Mouse', zone:'small'},{id:'b',label:'🐕 Dog', zone:'medium'},{id:'c',label:'🐘 Elephant',zone:'large'}], zones:[{id:'small', label:'Small 🐭'},{id:'medium', label:'Medium 🐕'},{id:'large', label:'Large 🐘'}], exp:'Mouse=small, Dog=medium, Elephant=large.' },
        { type:'mc', q:'Which is a DEGREE OF COMPARISON?', choices:['Fast','Faster','Running','Fast car'], answer:1, exp:'"Faster" = comparative degree. Tambah -er untuk 2 hal.' }
      ]
    },
    {
      id:'comparison', name:'Degree of Comparison', icon:'📊', color:'#673AB7',
      questions:[
        { type:'mc', q:'"A cat is _____ than a mouse."', img:'🐱', choices:['big','bigger','biggest','more big'], answer:1, exp:'Comparative: big → bigger. Tambah -er.' },
        { type:'fill', q:'Isi dengan superlative!', sentence:'Mount Everest is the _____ mountain.', bank:['highest','higher','high','more high'], answer:'highest', exp:'"Highest" = superlative. high → highest.' },
        { type:'drag', q:'Kelompokkan ke bentuk yang benar!', items:[{id:'a',label:'fast', zone:'positive'},{id:'b',label:'faster', zone:'comparative'},{id:'c',label:'fastest', zone:'superlative'},{id:'d',label:'tall', zone:'positive'},{id:'e',label:'taller', zone:'comparative'},{id:'f',label:'tallest', zone:'superlative'}], zones:[{id:'positive', label:'😐 Positive'},{id:'comparative', label:'⬆️ Comparative'},{id:'superlative', label:'🏆 Superlative'}], exp:'Positive: fast,tall. Comparative: faster,taller. Superlative: fastest,tallest.' },
        { type:'voice', q:'Baca kalimat perbandingan ini!', target:'An elephant is bigger than a horse', exp:'"An elephant is bigger than a horse" = Gajah lebih besar dari kuda.' },
        { type:'mc', q:'What is the SUPERLATIVE of "good"?', choices:['Gooder','More good','Best','Better'], answer:2, exp:'"Good → Better → Best". Bentuk irregular.' },
        { type:'match', q:'Pasangkan kata sifat dengan superlative-nya!', pairs:[{left:'good', right:'best'},{left:'bad', right:'worst'},{left:'many', right:'most'},{left:'little', right:'least'}], exp:'Irregular superlatives: good→best, bad→worst, many→most, little→least.' },
        { type:'fill', q:'Lengkapi!', sentence:'This is the _____ cake I have ever eaten!', bank:['most delicious','more delicious','delicious','deliciouser'], answer:'most delicious', exp:'"Most delicious" = paling lezat. Kata panjang pakai "most".' },
        { type:'mc', q:'"A whale is _____ than a shark."', choices:['more bigger','most big','bigger','bigest'], answer:2, exp:'"Bigger than" = lebih besar dari.' }
      ]
    },
    {
      id: 'kelas5_full', name: 'Bank Soal Kelas 5 (20 Soal)', icon: '🎓', color: '#3498DB',
      questions: [
        { type:'mc', q:'Every morning, Rian ______ a glass of milk before going to school.', img:'🥛', choices:['Drinks','Drink','Drinking','Drank'], answer:0, exp:'Karena subjeknya tunggal (Rian / He) dan merupakan kegiatan rutin; kata kerjanya ditambah -s (drinks).' },
        { type:'mc', q:'I have a sharp tool to cut paper. It is a pair of ______.', img:'✂️', choices:['Rulers','Scissors','Crayons','Glue'], answer:1, exp:'Alat tajam untuk memotong kertas adalah gunting (scissors).' },
        { type:'mc', q:'Mother: "Don\'t forget to wash your hands before eating." The Indonesian meaning of "wash your hands" is....', img:'🧼', choices:['Merapikan tempat tidur','Mencuci tangan','Menyikat gigi','Membersihkan meja'], answer:1, exp:'Wash your hands artinya mencuci tangan.' },
        { type:'mc', q:'Mr. Hadi goes to the sea everyday to catch fish. He is a ______.', img:'', choices:['Farmer','Fisherman','Gardener','Tailor'], answer:1, exp:'Orang yang pergi ke laut untuk menangkap ikan adalah nelayan (fisherman).' },
        { type:'mc', q:'A: "______ is that book?" B: "It is ten thousand rupiahs."', img:'', choices:['How many','How much','How long','How far'], answer:1, exp:'Untuk menanyakan harga barang; kita menggunakan "How much".' },
        { type:'mc', q:'The sugar is too ______ for me.', img:'🍬', choices:['Salty','Bitter','Sweet','Sour'], answer:2, exp:'Gula rasanya manis (sweet).' },
        { type:'mc', q:'My brother is an athlete. He likes playing ______.', img:'⚽', choices:['Chess','Cards','Football','Video games'], answer:2, exp:'Sebagai atlet; cabang olahraga yang cocok di pilihan adalah sepak bola (football).' },
        { type:'mc', q:'A giraffe has a ______ neck.', img:'', choices:['Short','Long','Small','Low'], answer:1, exp:'Jerapah memiliki leher yang panjang (long).' },
        { type:'mc', q:'We put our clothes in the ______.', img:'👕', choices:['Cupboard / Wardrobe','Refrigerator','Bookshelf','Table'], answer:0, exp:'Kita menaruh pakaian di dalam lemari pakaian (cupboard/wardrobe).' },
        { type:'mc', q:'A: "Can I borrow your pencil?" B: "Sure, ______."', img:'✏️', choices:['Here you are','No,thank you','Goodbye','I am busy'], answer:0, exp:'"Here you are" digunakan saat memberikan benda yang dipinjamkan ke orang lain.' },
        { type:'mc', q:'The sun rises in the ______.', img:'', choices:['West','North','East','South'], answer:2, exp:'Matahari terbit di sebelah timur (east).' },
        { type:'mc', q:'My uncle works in a restaurant. He cooks delicious food. He is a ______.', img:'', choices:['Waiter','Chef','Driver','Soldier'], answer:1, exp:'Orang yang memasak di restoran adalah koki/chef.' },
        { type:'mc', q:'The car cannot move because it lacks ______.', img:'🚗', choices:['Water','Fuel / Gasoline','Air','Oil'], answer:1, exp:'Mobil membutuhkan bahan bakar (fuel/gasoline) untuk dapat bergerak.' },
        { type:'mc', q:'A ______ is a place where we can save our money.', img:'', choices:['Bank','Hospital','Police station','School'], answer:0, exp:'Tempat untuk menabung/menyimpan uang yang aman adalah bank.' },
        { type:'mc', q:'We need a ______ to clear the dust from the floor.', img:'', choices:['Broom','Spoon','Knife','Comb'], answer:0, exp:'Kita membutuhkan sapu (broom) untuk membersihkan debu di lantai.' },
        { type:'mc', q:'The chili tastes very ______.', img:'🌶️', choices:['Sweet','Sour','Salty','Spicy'], answer:3, exp:'Cabai rasanya pedas (spicy).' },
        { type:'mc', q:'Ten multiplied by three is ______.', img:'', choices:['Thirteen','Thirty','Three','Twenty'], answer:1, exp:'Sepuluh dikali tiga adalah tiga puluh (thirty).' },
        { type:'mc', q:'He wants to borrow a book from the ______.', img:'📚', choices:['Canteen','Library','Classroom','Office'], answer:1, exp:'Tempat untuk meminjam buku di sekolah adalah perpustakaan (library).' },
        { type:'mc', q:'A cow produces ______.', img:'🐮', choices:['Egg','Wool','Milk','Honey'], answer:2, exp:'Sapi menghasilkan susu (milk).' },
        { type:'mc', q:'The Indonesian meaning of "Direction" is ______.', img:'🧭', choices:['Tujuan','Petunjuk / Arah','Kecepatan','Jarak'], answer:1, exp:'Direction artinya arah atau petunjuk jalan.' }
      ]
    }
  ],
  6: [
    {
      id:'future', name:'Future Tense', icon:'🚀', color:'#00BCD4',
      questions:[
        { type:'mc', q:'Which sentence is FUTURE TENSE?', choices:['She goes to school.','She went to school.','She will go to school.','She is going.'], answer:2, exp:'"Will + verb" = future tense.' },
        { type:'fill', q:'Lengkapi kalimat future tense!', sentence:'Tomorrow, I _____ visit my grandparents.', bank:['will','did','was','had'], answer:'will', exp:'"Will" digunakan untuk rencana masa depan.' },
        { type:'drag', q:'Kelompokkan kalimat ke tense yang benar!', items:[{id:'a',label:'She will sing', zone:'future'},{id:'b',label:'He sang', zone:'past'},{id:'c',label:'They eat', zone:'present'},{id:'d',label:'I will travel', zone:'future'},{id:'e',label:'We played', zone:'past'},{id:'f',label:'She reads', zone:'present'}], zones:[{id:'future', label:'🚀 Future'},{id:'past', label:'⏮️ Past'},{id:'present', label:'▶️ Present'}], exp:'Future: will sing/travel. Past: sang/played. Present: eat/reads.' },
        { type:'voice', q:'Ucapkan kalimat masa depan ini!', target:'I will study hard tomorrow', exp:'"I will study hard tomorrow" = Saya akan belajar keras besok.' },
        { type:'fill', q:'Isi!', sentence:'It _____ rain tomorrow, bring an umbrella!', bank:['will','rained','has','were'], answer:'will', exp:'"It will rain" = akan hujan. Prediksi pakai "will".' },
        { type:'match', q:'Pasangkan kalimat positive dengan negativenya!', pairs:[{left:'I will come', right:"I won't come"},{left:'She will eat', right:"She won't eat"},{left:'They will play', right:"They won't play"},{left:'He will sleep', right:"He won't sleep"}], exp:'"Will not" disingkat "won\'t". Bentuk negatif future tense.' },
        { type:'mc', q:'What is the negative of "She will come"?', choices:['She will not come.','She not will come.','She does not will come.','She will comes not.'], answer:0, exp:'Negatif: Subject + will + NOT + verb.' },
        { type:'drag', q:'Susun kalimat future tense!', items:[{id:'a',label:'🔮 Will be famous', zone:'future'},{id:'b',label:'📰 Was famous', zone:'past'},{id:'c',label:'🌟 Is famous', zone:'present'}], zones:[{id:'future', label:'🚀 Future Tense'},{id:'past', label:'⏮️ Past Tense'},{id:'present', label:'▶️ Present Tense'}], exp:'"Will be" = future, "Was" = past, "Is" = present.' },
        { type:'mc', q:'"Saya tidak akan makan daging" in English is...', choices:["I don't eat meat.","I won't eat meat.","I didn't eat meat.","I wasn't eating meat."], answer:1, exp:'"Won\'t" = will not. Future negative.' }
      ]
    },
    {
      id:'announcement', name:'Announcement', icon:'📢', color:'#FF5722',
      questions:[
        { type:'mc', q:'An announcement is...', img:'📢', choices:['A private letter.','A public notice giving information.','A secret message.','A type of question.'], answer:1, exp:'Announcement = pengumuman untuk umum (public notice).' },
        { type:'drag', q:'Susun bagian teks pengumuman!', items:[{id:'a',label:'📌 Title/Heading', zone:'opening'},{id:'b',label:'📅 Date & Time info', zone:'body'},{id:'c',label:'📍 Location info', zone:'body'},{id:'d',label:'📞 Contact info', zone:'closing'}], zones:[{id:'opening', label:'🔝 Opening'},{id:'body', label:'📝 Body'},{id:'closing', label:'🔚 Closing'}], exp:'Opening: Title. Body: Date/Time, Location. Closing: Contact info.' },
        { type:'fill', q:'Lengkapi!', sentence:'This is to _____ that school will be closed tomorrow.', bank:['announce','question','deny','ignore'], answer:'announce', exp:'"This is to announce that..." = frasa umum pembuka pengumuman.' },
        { type:'voice', q:'Baca pengumuman singkat ini!', target:'Please attend the school meeting tomorrow', exp:'"Please attend the school meeting tomorrow" = Mohon hadir di rapat sekolah besok.' },
        { type:'match', q:'Pasangkan frasa pengumuman dengan artinya!', pairs:[{left:'Please be informed', right:'Harap diketahui'},{left:'It is announced', right:'Diumumkan bahwa'},{left:'All students must', right:'Semua siswa harus'},{left:'For further info', right:'Untuk info lebih lanjut'}], exp:'Frasa baku yang sering muncul dalam teks announcement.' },
        { type:'fill', q:'Isi!', sentence:'All students are _____ to attend the flag ceremony.', bank:['required','forbidden','allowed','helped'], answer:'required', exp:'"Required to attend" = diwajibkan untuk hadir.' },
        { type:'mc', q:'"The library will be closed on Monday." What does it announce?', choices:['Library always open.','Library will be closed Monday.','Renovation starts Tuesday.','Books available Monday.'], answer:1, exp:'Pengumuman: perpustakaan tutup Senin untuk renovasi.' },
        { type:'fill', q:'Lengkapi!', sentence:'Please _____ your presence by Friday.', bank:['confirm','cancel','ignore','delay'], answer:'confirm', exp:'"Confirm your presence" = konfirmasi kehadiran.' }
      ]
    },
    {
      id:'jobs', name:'Jobs & Professions', icon:'👨‍💼', color:'#795548',
      questions:[
        { type:'mc', q:'What is a "dokter" in English?', img:'👨‍⚕️', choices:['Nurse','Doctor','Dentist','Teacher'], answer:1, exp:'"Doctor" = dokter.' },
        { type:'drag', q:'Kelompokkan pekerjaan berdasarkan bidangnya!', items:[{id:'a',label:'👨‍⚕️ Doctor', zone:'health'},{id:'b',label:'👨‍🏫 Teacher', zone:'education'},{id:'c',label:'👩‍⚕️ Nurse', zone:'health'},{id:'d',label:'👩‍💻 Engineer', zone:'tech'},{id:'e',label:'📚 Librarian', zone:'education'},{id:'f',label:'💻 Programmer',zone:'tech'}], zones:[{id:'health', label:'🏥 Health'},{id:'education', label:'🎓 Education'},{id:'tech', label:'💻 Technology'}], exp:'Health: Doctor,Nurse. Education: Teacher,Librarian. Tech: Engineer,Programmer.' },
        { type:'fill', q:'Lengkapi!', sentence:'A _____ teaches students in a school.', bank:['teacher','doctor','pilot','farmer'], answer:'teacher', exp:'"Teacher" = guru. Mengajar siswa di sekolah.' },
        { type:'voice', q:'Ucapkan cita-citamu!', target:'I want to be a doctor in the future', exp:'"I want to be a doctor in the future" = Saya ingin jadi dokter di masa depan.' },
        { type:'match', q:'Pasangkan pekerjaan dengan tugasnya!', pairs:[{left:'Pilot', right:'Flies airplane'},{left:'Chef', right:'Cooks food'},{left:'Farmer', right:'Grows crops'},{left:'Doctor', right:'Treats patients'}], exp:'Pilot=flies, Chef=cooks, Farmer=grows crops, Doctor=treats patients.' },
        { type:'fill', q:'Isi!', sentence:'A _____ writes news for newspapers.', bank:['journalist','musician','athlete','programmer'], answer:'journalist', exp:'"Journalist" = jurnalis/wartawan.' },
        { type:'mc', q:'My father fixes broken cars. He is a...', img:'🔧', choices:['Engineer','Mechanic','Electrician','Carpenter'], answer:1, exp:'"Mechanic" = mekanik, memperbaiki kendaraan.' },
        { type:'drag', q:'Pasangkan pekerjaan ke tempatnya bekerja!', items:[{id:'a',label:'👨‍⚕️ Doctor', zone:'hospital'},{id:'b',label:'👨‍🍳 Chef', zone:'kitchen'},{id:'c',label:'🧑‍🏫 Teacher', zone:'school'},{id:'d',label:'✈️ Pilot', zone:'airplane'}], zones:[{id:'hospital', label:'🏥 Hospital'},{id:'kitchen', label:'🍳 Kitchen'},{id:'school', label:'🏫 School'},{id:'airplane', label:'✈️ Airplane'}], exp:'Doctor=Hospital, Chef=Kitchen, Teacher=School, Pilot=Airplane.' },
        { type:'mc', q:'"I want to ___ a pilot" uses which verb?', choices:['make','do','be','have'], answer:2, exp:'"I want to BE a pilot" = saya ingin menjadi pilot. "Be" untuk menyatakan profesi.' }
      ]
    },
    {
      id: 'kelas6_full', name: 'Bank Soal Kelas 6 (20 Soal)', icon: '', color: '#9B59B6',
      questions: [
        { type:'mc', q:'Look at the clock. It is 07.00 AM. How do you say it in English?', img:'⏰', choices:['It is seven o\'clock in the evening.','It is seven o\'clock in the morning.','It is twelve o\'clock in the afternoon.','It is seven o\'clock at night.'], answer:1, exp:'Kode AM menunjukkan waktu dini hari sampai siang; jadi pukul 07.00 AM adalah seven o\'clock in the morning.' },
        { type:'mc', q:'A: "Do you like fried rice?" B: "Yes, ______."', img:'🍚', choices:['I am','I do not','I do','You do'], answer:2, exp:'Pertanyaan diawali dengan kata "Do you...?"; jika jawabannya setuju (Yes); maka pasangannya adalah "I do".' },
        { type:'mc', q:'People go to the ______ to travel by train.', img:'🚂', choices:['Airport','Harbor','Station','Bus stop'], answer:2, exp:'Stasiun (station) adalah tempat untuk bepergian menggunakan kereta api.' },
        { type:'mc', q:'She ______ to the school by bicycle yesterday.', img:'🚲', choices:['Go','Goes','Going','Went'], answer:3, exp:'Karena ada keterangan waktu lampau "yesterday"; kata kerja yang digunakan adalah V2 (went).' },
        { type:'mc', q:'The capital city of Indonesia is ______.', img:'🇮🇩', choices:['Surabaya','Bandung','Jakarta','Medan'], answer:2, exp:'Ibu kota Indonesia adalah Jakarta.' },
        { type:'mc', q:'A ______ helps a doctor to take care of patients in a hospital.', img:'🏥', choices:['Nurse','Teacher','Secretary','Dentist'], answer:0, exp:'Orang yang membantu dokter merawat pasien adalah perawat (nurse).' },
        { type:'mc', q:'The highest mountain in the world is Mount ______.', img:'🏔️', choices:['Bromo','Fuji','Everest','Semeru'], answer:2, exp:'Gunung tertinggi di dunia adalah Gunung Everest.' },
        { type:'mc', q:'My sister wants to buy a dress. She is going to the ______.', img:'👗', choices:['Traditional market','Boutique / Clothing store','Pharmacy','Bookstore'], answer:1, exp:'Tempat khusus untuk membeli pakaian atau gaun adalah butik (boutique/clothing store).' },
        { type:'mc', q:'A: "Would you like a cup of tea?" B: "No, ______. I am full."', img:'☕', choices:['Please','Thank you','Excuse me','Sorry'], answer:1, exp:'"No, thank you" adalah cara sopan untuk menolak tawaran makanan/minuman.' },
        { type:'mc', q:'An ice cube is very ______.', img:'🧊', choices:['Hot','Warm','Cold','Boiling'], answer:2, exp:'Es batu rasanya sangat dingin (cold).' },
        { type:'mc', q:'The computer is an ______ device.', img:'💻', choices:['Traditional','Electronic','Mechanical','Manual'], answer:1, exp:'Komputer merupakan perangkat elektronik (electronic).' },
        { type:'mc', q:'We can cross the river safely by walking over the ______.', img:'', choices:['Road','Bridge','Tunnel','Wall'], answer:1, exp:'Kita bisa menyeberangi sungai dengan aman melewati jembatan (bridge).' },
        { type:'mc', q:'The internet helps us to search for ______.', img:'🌐', choices:['Trash','Information','Water','Food'], answer:1, exp:'Internet sangat membantu kita untuk mencari informasi (information).' },
        { type:'mc', q:'He is very smart. He always ______ the exam.', img:'', choices:['Fails','Passes','Drops','Loses'], answer:1, exp:'Orang yang pintar biasanya lulus (passes) ujian.' },
        { type:'mc', q:'What is the antonym (lawan kata) of "Expensive"?', img:'💸', choices:['Dear','Cheap','Costly','Valuable'], answer:1, exp:'Lawan kata dari mahal (expensive) adalah murah (cheap).' },
        { type:'mc', q:'A ______ creates beautiful paintings.', img:'🎨', choices:['Singer','Dancer','Painter','Writer'], answer:2, exp:'Orang yang membuat lukisan indah disebut pelukis (painter).' },
        { type:'mc', q:'Our national flag has two colors. They are ______.', img:'🇮🇩', choices:['Red and Blue','Red and White','Black and White','Green and Yellow'], answer:1, exp:'Bendera nasional kita berwarna merah dan putih (red and white).' },
        { type:'mc', q:'Smoking is bad for our ______.', img:'🚭', choices:['Health','Wealth','Hobby','Car'], answer:0, exp:'Merokok berakibat buruk bagi kesehatan (health).' },
        { type:'mc', q:'We need to buy a ______ before entering the cinema.', img:'🎬', choices:['Popcorn','Ticket','Chair','Screen'], answer:1, exp:'Kita harus membeli tiket (ticket) sebelum masuk ke dalam bioskop.' },
        { type:'mc', q:'The Indonesian meaning of "Environment" is ______.', img:'🌍', choices:['Pemerintah','Lingkungan','Masyarakat','Pendidikan'], answer:1, exp:'Environment artinya lingkungan.' }
      ]
    }
  ]
};