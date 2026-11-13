
import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PrivacyArchitecture: React.FC = () => {
  const privacyPoints = [
    {
      title: 'Zero Server Uploads',
      detail:
        'Your images are never transmitted over the internet to remote servers or cloud storage.',
    },
    {
      title: '100% In-Browser Execution',
      detail:
        'Calculations occur entirely on your device CPU using Canvas and ImageBitmap APIs.',
    },
    {
      title: 'Ephemeral Memory Lifecycle',
      detail:
        'Memory buffers are automatically garbage-collected when files are cleared or the tab closes.',
    },
    {
      title: 'Offline Capable',
      detail:
        'Once loaded, Webistic works seamlessly even with your network disconnected.',
    },
  ];

  return (
    <main className="flex-1 min-h-screen bg-[#25282B] text-[#E8DFC9]">
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2563FF] mb-3">
              Security & Privacy
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#2563FF] shrink-0" />
              Privacy Architecture
            </h1>

            <p className="text-sm sm:text-base text-[#E8DFC9]/70 max-w-2xl leading-relaxed">
              Webistic is engineered for complete data isolation.
              Confidential documents and private photographs remain entirely
              on your device.
            </p>
          </div>

          <h2 className="text-lg font-bold mb-4">
            Client-Side Privacy Architecture
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {privacyPoints.map((point) => (
              <div
                key={point.title}
                className="p-5 rounded-xl border border-[#E8DFC9]/15 bg-[#2D3033]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2563FF] shrink-0" />
                  <h3 className="text-sm font-bold">{point.title}</h3>
                </div>

                <p className="text-xs text-[#E8DFC9]/65 leading-relaxed pl-7">
                  {point.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
