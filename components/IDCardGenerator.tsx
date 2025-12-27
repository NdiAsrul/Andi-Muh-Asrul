
import React, { useState, useRef, useEffect } from 'react';

const IDCardGenerator: React.FC = () => {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Gradient
    const grd = ctx.createLinearGradient(0, 0, 600, 350);
    grd.addColorStop(0, "#0F2C59");
    grd.addColorStop(1, "#1E3A8A");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 600, 350);

    // Decorative circles
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath(); ctx.arc(500, 50, 100, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(100, 300, 80, 0, 2 * Math.PI); ctx.fill();

    // Headers
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 24px Arial";
    ctx.fillText("UNIVERSITAS AL-AZHAR INDONESIA", 20, 50);
    ctx.fillStyle = "#C5A059";
    ctx.font = "bold 18px Arial";
    ctx.fillText("PROGRAM STUDI GIZI", 20, 75);

    // Photo placeholder / image
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(100, 180, 70, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 30, 110, 140, 140);
        ctx.restore();
        
        ctx.beginPath();
        ctx.arc(100, 180, 70, 0, Math.PI * 2, true);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#C5A059";
        ctx.stroke();

        drawText(ctx);
      };
    } else {
        ctx.beginPath();
        ctx.arc(100, 180, 70, 0, Math.PI * 2, true);
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.stroke();
        drawText(ctx);
    }
  };

  const drawText = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 16px Arial";
    ctx.fillText("CALON MAHASISWA", 200, 150);
    ctx.font = "bold 32px Arial";
    ctx.fillText(name.toUpperCase() || "NAMA LENGKAP", 200, 190);
    ctx.font = "italic 18px Arial";
    ctx.fillStyle = "#E2E8F0";
    ctx.fillText(school || "Asal Sekolah", 200, 220);

    // Footer
    ctx.fillStyle = "#C5A059";
    ctx.fillRect(0, 310, 600, 40);
    ctx.fillStyle = "#0F2C59";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("CALON MAHASISWA GIZI UAI 2026", 300, 335);
    ctx.textAlign = "start"; // reset
  };

  useEffect(() => {
    drawCard();
  }, [name, school, image]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `ID-Card-Gizi-${name || 'Candidate'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Lengkap</label>
            <input 
              type="text" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ketik nama Anda..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Asal Sekolah</label>
            <input 
              type="text" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="SMA / MA / SMK..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pas Foto</label>
            <input 
              type="file" 
              accept="image/*"
              className="w-full p-2 text-xs"
              onChange={handleImageUpload}
            />
          </div>
          <button 
            onClick={download}
            className="w-full bg-[#C5A059] text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-gold/20 transition-all"
          >
            Download Kartu
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center">
           <div className="w-full max-w-[350px] aspect-[600/350] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-[#0F2C59]">
              <canvas 
                ref={canvasRef} 
                width={600} 
                height={350} 
                className="w-full h-auto block"
              ></canvas>
           </div>
           <p className="mt-4 text-[10px] text-slate-400 font-medium italic">Preview Kartu Tanda Calon Mahasiswa</p>
        </div>
      </div>
    </div>
  );
};

export default IDCardGenerator;
