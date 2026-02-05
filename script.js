<<<<<<< HEAD
let malzemeler = [];
let urunler = [];

function veriKaydet() {
    localStorage.setItem('malzemeler', JSON.stringify(malzemeler));
    localStorage.setItem('urunler', JSON.stringify(urunler));
}

function veriYukle() {
    const kaydedilmisMalzemeler = localStorage.getItem('malzemeler');
    const kaydedilmisUrunler = localStorage.getItem('urunler');
    
    if (kaydedilmisMalzemeler) {
        malzemeler = JSON.parse(kaydedilmisMalzemeler);
    }
    
    if (kaydedilmisUrunler) {
        urunler = JSON.parse(kaydedilmisUrunler);
    }
}

function malzemeEkle() {
    const adi = document.getElementById('malzemeAdi').value.trim();
    const fiyat = parseFloat(document.getElementById('malzemeFiyat').value);
    const birim = document.getElementById('malzemeBirim').value.trim();

    if (!adi || !fiyat || !birim || fiyat <= 0) {
        alert('Lütfen tüm alanları doğru şekilde doldurun!');
        return;
    }

    const malzeme = {
        id: Date.now(),
        adi: adi,
        fiyat: fiyat,
        birim: birim
    };

    malzemeler.push(malzeme);
    veriKaydet();
    malzemeListesiniGuncelle();
    
    document.getElementById('malzemeAdi').value = '';
    document.getElementById('malzemeFiyat').value = '';
    document.getElementById('malzemeBirim').value = '';
}

function malzemeSil(id) {
    if (confirm('Bu malzemeyi silmek istediğinizden emin misiniz?')) {
        malzemeler = malzemeler.filter(m => m.id !== id);
        urunler.forEach(urun => {
            urun.malzemeler = urun.malzemeler.filter(m => m.malzemeId !== id);
        });
        veriKaydet();
        malzemeListesiniGuncelle();
        urunListesiniGuncelle();
    }
}

function malzemeListesiniGuncelle() {
    const tbody = document.getElementById('malzemeListesi');
    tbody.innerHTML = '';

    malzemeler.forEach(malzeme => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${malzeme.adi}</td>
            <td>${malzeme.fiyat.toFixed(2)} ₺</td>
            <td>${malzeme.birim}</td>
            <td><button class="btn-sil" onclick="malzemeSil(${malzeme.id})">Sil</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function urunEkle() {
    const adi = document.getElementById('urunAdi').value.trim();

    if (!adi) {
        alert('Lütfen ürün adını girin!');
        return;
    }

    const urun = {
        id: Date.now(),
        adi: adi,
        malzemeler: [],
        uretimAdedi: 1
    };

    urunler.push(urun);
    veriKaydet();
    urunListesiniGuncelle();
    
    document.getElementById('urunAdi').value = '';
}

function urunSil(id) {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
        urunler = urunler.filter(u => u.id !== id);
        veriKaydet();
        urunListesiniGuncelle();
    }
}

function uruneMalzemeEkle(urunId) {
    const select = document.getElementById(`malzeme-select-${urunId}`);
    const miktar = parseFloat(document.getElementById(`miktar-${urunId}`).value);

    if (!select.value || !miktar || miktar <= 0) {
        alert('Lütfen malzeme seçin ve miktar girin!');
        return;
    }

    const malzemeId = parseInt(select.value);
    const urun = urunler.find(u => u.id === urunId);
    const malzeme = malzemeler.find(m => m.id === malzemeId);

    if (urun.malzemeler.find(m => m.malzemeId === malzemeId)) {
        alert('Bu malzeme zaten eklenmiş!');
        return;
    }

    urun.malzemeler.push({
        malzemeId: malzemeId,
        adi: malzeme.adi,
        fiyat: malzeme.fiyat,
        birim: malzeme.birim,
        miktar: miktar
    });

    document.getElementById(`miktar-${urunId}`).value = '';
    select.value = '';
    veriKaydet();
    urunListesiniGuncelle();
}

function urundenMalzemeSil(urunId, malzemeId) {
    const urun = urunler.find(u => u.id === urunId);
    urun.malzemeler = urun.malzemeler.filter(m => m.malzemeId !== malzemeId);
    veriKaydet();
    urunListesiniGuncelle();
}

function toplamMaliyetHesapla(urun) {
    return urun.malzemeler.reduce((toplam, malzeme) => {
        return toplam + (malzeme.fiyat * malzeme.miktar);
    }, 0);
}

function uretimAdediGuncelle(urunId, yeniAdet) {
    const adet = parseInt(yeniAdet);
    if (adet < 1) {
        alert('Üretim adedi en az 1 olmalıdır!');
        return;
    }
    
    const urun = urunler.find(u => u.id === urunId);
    if (urun) {
        urun.uretimAdedi = adet;
        veriKaydet();
        urunListesiniGuncelle();
    }
}

function urunListesiniGuncelle() {
    const container = document.getElementById('urunListesi');
    container.innerHTML = '';

    if (urunler.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Henüz ürün eklenmedi.</p>';
        return;
    }

    urunler.forEach(urun => {
        const card = document.createElement('div');
        card.className = 'urun-card';

        let malzemeSecimHTML = '';
        if (malzemeler.length > 0) {
            malzemeSecimHTML = `
                <div class="malzeme-secim">
                    <select id="malzeme-select-${urun.id}">
                        <option value="">Malzeme Seçin</option>
                        ${malzemeler.map(m => `<option value="${m.id}">${m.adi} (${m.fiyat.toFixed(2)} ₺/${m.birim})</option>`).join('')}
                    </select>
                    <input type="number" id="miktar-${urun.id}" placeholder="Miktar" step="0.01" min="0">
                    <button onclick="uruneMalzemeEkle(${urun.id})">Malzeme Ekle</button>
                </div>
            `;
        }

        let malzemeListesiHTML = '';
        if (urun.malzemeler.length > 0) {
            malzemeListesiHTML = urun.malzemeler.map(m => `
                <div class="malzeme-item">
                    <span>${m.adi}: ${m.miktar} ${m.birim} × ${m.fiyat.toFixed(2)} ₺ = ${(m.fiyat * m.miktar).toFixed(2)} ₺</span>
                    <button class="btn-sil" onclick="urundenMalzemeSil(${urun.id}, ${m.malzemeId})">Sil</button>
                </div>
            `).join('');
        } else {
            malzemeListesiHTML = '<p style="text-align: center; color: #999;">Henüz malzeme eklenmedi.</p>';
        }

        const toplamMaliyet = toplamMaliyetHesapla(urun);
        const uretimAdedi = urun.uretimAdedi || 1;
        const birimMaliyet = toplamMaliyet / uretimAdedi;

        card.innerHTML = `
            <div class="urun-header">
                <h3>${urun.adi}</h3>
                <button class="btn-sil" onclick="urunSil(${urun.id})">Ürünü Sil</button>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #667eea;">Üretim Adedi:</label>
                <input type="number" id="uretim-adet-${urun.id}" value="${uretimAdedi}" min="1" step="1" 
                       style="width: 150px;" onchange="uretimAdediGuncelle(${urun.id}, this.value)">
            </div>
            ${malzemeSecimHTML}
            <div style="margin-top: 20px;">
                ${malzemeListesiHTML}
            </div>
            <div class="toplam">
                Toplam Maliyet: ${toplamMaliyet.toFixed(2)} ₺<br>
                Birim Maliyet: ${birimMaliyet.toFixed(2)} ₺/${uretimAdedi} adet
            </div>
        `;

        container.appendChild(card);
    });
}

veriYukle();
malzemeListesiniGuncelle();
urunListesiniGuncelle();
=======
let malzemeler = [];
let urunler = [];

function veriKaydet() {
    localStorage.setItem('malzemeler', JSON.stringify(malzemeler));
    localStorage.setItem('urunler', JSON.stringify(urunler));
}

function veriYukle() {
    const kaydedilmisMalzemeler = localStorage.getItem('malzemeler');
    const kaydedilmisUrunler = localStorage.getItem('urunler');
    
    if (kaydedilmisMalzemeler) {
        malzemeler = JSON.parse(kaydedilmisMalzemeler);
    }
    
    if (kaydedilmisUrunler) {
        urunler = JSON.parse(kaydedilmisUrunler);
    }
}

function malzemeEkle() {
    const adi = document.getElementById('malzemeAdi').value.trim();
    const fiyat = parseFloat(document.getElementById('malzemeFiyat').value);
    const birim = document.getElementById('malzemeBirim').value.trim();

    if (!adi || !fiyat || !birim || fiyat <= 0) {
        alert('Lütfen tüm alanları doğru şekilde doldurun!');
        return;
    }

    const malzeme = {
        id: Date.now(),
        adi: adi,
        fiyat: fiyat,
        birim: birim
    };

    malzemeler.push(malzeme);
    veriKaydet();
    malzemeListesiniGuncelle();
    
    document.getElementById('malzemeAdi').value = '';
    document.getElementById('malzemeFiyat').value = '';
    document.getElementById('malzemeBirim').value = '';
}

function malzemeSil(id) {
    if (confirm('Bu malzemeyi silmek istediğinizden emin misiniz?')) {
        malzemeler = malzemeler.filter(m => m.id !== id);
        urunler.forEach(urun => {
            urun.malzemeler = urun.malzemeler.filter(m => m.malzemeId !== id);
        });
        veriKaydet();
        malzemeListesiniGuncelle();
        urunListesiniGuncelle();
    }
}

function malzemeListesiniGuncelle() {
    const tbody = document.getElementById('malzemeListesi');
    tbody.innerHTML = '';

    malzemeler.forEach(malzeme => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${malzeme.adi}</td>
            <td>${malzeme.fiyat.toFixed(2)} ₺</td>
            <td>${malzeme.birim}</td>
            <td><button class="btn-sil" onclick="malzemeSil(${malzeme.id})">Sil</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function urunEkle() {
    const adi = document.getElementById('urunAdi').value.trim();

    if (!adi) {
        alert('Lütfen ürün adını girin!');
        return;
    }

    const urun = {
        id: Date.now(),
        adi: adi,
        malzemeler: []
    };

    urunler.push(urun);
    veriKaydet();
    urunListesiniGuncelle();
    
    document.getElementById('urunAdi').value = '';
}

function urunSil(id) {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
        urunler = urunler.filter(u => u.id !== id);
        veriKaydet();
        urunListesiniGuncelle();
    }
}

function uruneMalzemeEkle(urunId) {
    const select = document.getElementById(`malzeme-select-${urunId}`);
    const miktar = parseFloat(document.getElementById(`miktar-${urunId}`).value);

    if (!select.value || !miktar || miktar <= 0) {
        alert('Lütfen malzeme seçin ve miktar girin!');
        return;
    }

    const malzemeId = parseInt(select.value);
    const urun = urunler.find(u => u.id === urunId);
    const malzeme = malzemeler.find(m => m.id === malzemeId);

    if (urun.malzemeler.find(m => m.malzemeId === malzemeId)) {
        alert('Bu malzeme zaten eklenmiş!');
        return;
    }

    urun.malzemeler.push({
        malzemeId: malzemeId,
        adi: malzeme.adi,
        fiyat: malzeme.fiyat,
        birim: malzeme.birim,
        miktar: miktar
    });

    document.getElementById(`miktar-${urunId}`).value = '';
    select.value = '';
    veriKaydet();
    urunListesiniGuncelle();
}

function urundenMalzemeSil(urunId, malzemeId) {
    const urun = urunler.find(u => u.id === urunId);
    urun.malzemeler = urun.malzemeler.filter(m => m.malzemeId !== malzemeId);
    veriKaydet();
    urunListesiniGuncelle();
}

function toplamMaliyetHesapla(urun) {
    return urun.malzemeler.reduce((toplam, malzeme) => {
        return toplam + (malzeme.fiyat * malzeme.miktar);
    }, 0);
}

function urunListesiniGuncelle() {
    const container = document.getElementById('urunListesi');
    container.innerHTML = '';

    if (urunler.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Henüz ürün eklenmedi.</p>';
        return;
    }

    urunler.forEach(urun => {
        const card = document.createElement('div');
        card.className = 'urun-card';

        let malzemeSecimHTML = '';
        if (malzemeler.length > 0) {
            malzemeSecimHTML = `
                <div class="malzeme-secim">
                    <select id="malzeme-select-${urun.id}">
                        <option value="">Malzeme Seçin</option>
                        ${malzemeler.map(m => `<option value="${m.id}">${m.adi} (${m.fiyat.toFixed(2)} ₺/${m.birim})</option>`).join('')}
                    </select>
                    <input type="number" id="miktar-${urun.id}" placeholder="Miktar" step="0.01" min="0">
                    <button onclick="uruneMalzemeEkle(${urun.id})">Malzeme Ekle</button>
                </div>
            `;
        }

        let malzemeListesiHTML = '';
        if (urun.malzemeler.length > 0) {
            malzemeListesiHTML = urun.malzemeler.map(m => `
                <div class="malzeme-item">
                    <span>${m.adi}: ${m.miktar} ${m.birim} × ${m.fiyat.toFixed(2)} ₺ = ${(m.fiyat * m.miktar).toFixed(2)} ₺</span>
                    <button class="btn-sil" onclick="urundenMalzemeSil(${urun.id}, ${m.malzemeId})">Sil</button>
                </div>
            `).join('');
        } else {
            malzemeListesiHTML = '<p style="text-align: center; color: #999;">Henüz malzeme eklenmedi.</p>';
        }

        const toplamMaliyet = toplamMaliyetHesapla(urun);

        card.innerHTML = `
            <div class="urun-header">
                <h3>${urun.adi}</h3>
                <button class="btn-sil" onclick="urunSil(${urun.id})">Ürünü Sil</button>
            </div>
            ${malzemeSecimHTML}
            <div style="margin-top: 20px;">
                ${malzemeListesiHTML}
            </div>
            <div class="toplam">Toplam Maliyet: ${toplamMaliyet.toFixed(2)} ₺</div>
        `;

        container.appendChild(card);
    });
}

veriYukle();
malzemeListesiniGuncelle();
urunListesiniGuncelle();

>>>>>>> 5551c3ac253bd8e89164bf43265ff94f849b1d5c

