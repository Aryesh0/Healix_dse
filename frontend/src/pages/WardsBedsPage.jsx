import { useEffect, useState } from 'react';
import { Bed, Users } from 'lucide-react';
import api from '../api/axios';

const WardsBedsPage = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWards = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/wards');
      setWards(res.data.data || []);
    } catch (e) {
      setError('Unable to load wards. Please ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWards();
  }, []);

  const adjustOccupancy = async (wardName, delta) => {
    try {
      await api.patch(`/wards/${encodeURIComponent(wardName)}/occupancy`, null, { params: { delta } });
      fetchWards();
    } catch (e) {
      setError('Failed to update occupancy.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Wards & Beds Capacity</h1>
          <p className="text-slate-500">Real-time hospital bed allocation and intensive care tracking.</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && wards.map((ward, idx) => {
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

              <div className="flex gap-2 mt-2">
                <button className="btn btn-outline px-3 py-1 text-sm" onClick={() => adjustOccupancy(ward.name, 1)}>Admit</button>
                <button className="btn btn-outline px-3 py-1 text-sm" onClick={() => adjustOccupancy(ward.name, -1)}>Discharge</button>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="col-span-full text-center text-slate-400">Loading wards...</div>
        )}
      </div>
    </div>
  );
};

export default WardsBedsPage;
