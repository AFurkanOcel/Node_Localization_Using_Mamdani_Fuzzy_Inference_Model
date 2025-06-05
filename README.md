# Kablosuz Sensör Ağlarında Bulanık Mantık ile Düğüm Lokalizasyonu

Bu projede, **kablosuz sensör ağlarında (WSN)** düğüm konumlarının belirlenmesi problemi, **bulanık mantık** yöntemleri kullanılarak çözülmüştür. Amaç, düğümlerin ortalama lokalizasyon hatasını (ALE) minimuma indirmektir.

## 📌 Proje Amacı

Koordinatları bilinmeyen düğümlerin konumlarını, bulanık çıkarım sistemi ile tahmin ederek, düşük hatayla yüksek doğruluk elde etmek.

## 🧠 Kullanılan Yöntem

- **Bulanık Çıkarım Sistemi:** Mamdani tipi
- **Üyelik Fonksiyonları:** Triangular, Gaussian
- **Berraklaştırma (Defuzzification):** Center of Sums, Weighted Average
- Toplamda 4 farklı kombinasyon test edilmiştir.

## 📊 Performans Sonuçları

| Metrik       | Değer      |
|--------------|------------|
| MAE          | 0.234      |
| RMSE         | 0.305      |
| Doğruluk     | %69.0      |

**En iyi sonuç:** Gaussian üyelik fonksiyonu + Weighted Average berraklaştırma

## 🗃️ Veri Kümesi

- UCI Machine Learning Repository'den alınmıştır  
- 107 örnek, 6 özellik
- Girişler: Çapa oranı, iletim aralığı, düğüm yoğunluğu, yineleme sayısı  
- Çıkış: Ortalama Lokalizasyon Hatası (ALE)

## 🚀 Gelecek Planlar

- Sugeno tipi sistemlerle karşılaştırma
- Gerçek zamanlı verilerle test
- Daha büyük veri kümeleriyle genel performans ölçümü

## 🤝 Katkıda Bulunmak

İyileştirme önerilerinizi, hata bildirimlerinizi ve katkılarınızı memnuniyetle bekliyoruz.

## 📄 Lisans

Bu proje eğitim amaçlıdır. Lisans gerektiren durumlarda lütfen iletişime geçiniz.
