import { Bed, Users } from 'lucide-react';

const wards = [
  { name: 'General Ward A', totalBeds: 20, occupied: 18, color: 'blue' },
  { name: 'General Ward B', totalBeds: 20, occupied: 12, color: 'blue' },
  { name: 'ICU', totalBeds: 10, occupied: 9, color: 'red' },
  { name: 'Maternity', totalBeds: 15, occupied: 15, color: 'pink' },
  { name: 'Pediatrics', totalBeds: 15, occupied: 5, color: 'orange' },
];

const WardsBedsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Wards & Beds Capacity</h1>
          <p className="text-slate-500">Real-time hospital bed allocation and intensive care tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wards.map((ward, idx) => {
          const occupancyRate = Math.round((ward.occupied / ward.totalBeds) * 100);
          const isFull = ward.occupied === ward.totalBeds;
          
          return (
            <div key={idx} className="card p-6 bg-white shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-bold text-[#1A2B6D]">{ward.name}</h2>
                <div className={`p-2 rounded-lg bg-${ward.color}-50 text-${ward.color}-600`}>
                  <Bed size={20} />
                </div>
              </div>

              <div className="flex items-end gap-2 my-2">
                <span className="text-4xl font-black text-slate-800">{ward.occupied}</span>
                <span className="text-slate-500 font-medium pb-1">/ {ward.totalBeds} Beds</span>
              </div>

              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-[#2E5BFF]'}`}
                  style={{ width: `${occupancyRate}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-sm font-medium mt-1">
                <span className={isFull ? 'text-red-600' : 'text-[#2E5BFF]'}>
                  {isFull ? 'Critically Full' : `${occupancyRate}% Occupied`}
                </span>
                <span className="text-slate-500">{ward.totalBeds - ward.occupied} Available</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WardsBedsPage;
