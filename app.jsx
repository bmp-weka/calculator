import React, { useState, useEffect } from 'react';

export default function CalculatorApp() {
  const [numServers, setNumServers] = useState('');
  const [numNVMe, setNumNVMe] = useState('');
  const [nvmeSize, setNvmeSize] = useState('');
  // const [data, setData] = useState('');
  const [data, setData] = useState('');
  const [parity, setParity] = useState('');
  const [spare, setSpare] = useState('');
  const [result, setResult] = useState(null);
  const [rawPerNode, setRawPerNode] = useState(null);
  const [rawTotal, setRawTotal] = useState(null);
  const [usableCapacity, setUsableCapacity] = useState(null);
  const [efficiency, setEfficiency] = useState(null);

  useEffect(() => {
    // Automatically calculate Data Stripe using formula: IF(SUM(numServers - parity -1)>16,16,SUM(numServers - parity -1))
    const serversNum = parseFloat(numServers);
    const parityNum = parseFloat(parity);
    if (!isNaN(serversNum) && !isNaN(parityNum)) {
      const computedData = Math.min(16, serversNum - parityNum - 1);
      setData(!isNaN(computedData) && computedData > 0 ? computedData.toString() : '');
    }

    const servers = parseFloat(numServers);
    const nvme = parseFloat(numNVMe);
    const size = parseFloat(nvmeSize);
    const parityValue = parseFloat(parity);
    const dataValue = Math.min(16, servers - parityValue - 1);
    const spareValue = parseFloat(spare);

    let totalDrives = null;
    let rawPerNodeCapacity = null;
    let rawTotalCapacity = null;
    let totalUsableCapacity = null;
    let efficiencyValue = null;

    if (!isNaN(servers) && !isNaN(nvme)) {
      totalDrives = servers * nvme;
    }

    if (!isNaN(nvme) && !isNaN(size)) {
      rawPerNodeCapacity = nvme * size;
    }

    if (!isNaN(servers) && !isNaN(nvme) && !isNaN(size)) {
      rawTotalCapacity = servers * nvme * size;
    }

    if (
      !isNaN(rawTotalCapacity) &&
      !isNaN(servers) &&
      !isNaN(spareValue) &&
      !isNaN(dataValue) &&
      !isNaN(parityValue) &&
      (dataValue + parityValue) !== 0
    ) {
      totalUsableCapacity =
        rawTotalCapacity * ((servers - spareValue) / servers) * (dataValue / (dataValue + parityValue)) * 0.9;
    }

    if (!isNaN(totalUsableCapacity) && !isNaN(rawTotalCapacity) && rawTotalCapacity !== 0) {
      efficiencyValue = totalUsableCapacity / rawTotalCapacity;
    }

    setResult(totalDrives !== null ? `Total Number of drives: ${totalDrives.toLocaleString()}` : null);
    setRawPerNode(rawPerNodeCapacity !== null ? `Raw Per Host Capacity TB: ${rawPerNodeCapacity.toLocaleString()}` : null);
    setRawTotal(rawTotalCapacity !== null ? `Total Raw Capacity TB: ${rawTotalCapacity.toLocaleString()}` : null);
    setUsableCapacity(totalUsableCapacity !== null ? `Total Usable Capacity TB: ${totalUsableCapacity.toLocaleString()}` : null);
    setEfficiency(efficiencyValue !== null ? `Efficiency: ${(efficiencyValue * 100).toFixed(2)}%` : null);
  }, [numServers, numNVMe, nvmeSize, data, parity, spare]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Capacity Calculator</h1>
      <div className="flex border border-gray-300 rounded-lg shadow-md p-6 bg-white">
        <div className="flex flex-col space-y-4 mr-12">
          <input
            type="text"
            value={numServers}
            onChange={(e) => setNumServers(e.target.value)}
            placeholder="# of Backend Servers"
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            value={numNVMe}
            onChange={(e) => setNumNVMe(e.target.value)}
            placeholder="# NVMe per System"
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            value={nvmeSize}
            onChange={(e) => setNvmeSize(e.target.value)}
            placeholder="NVMe Size"
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            value={data}
            readOnly
            placeholder="Data Stripe (auto-calculated)"
            className="p-2 border rounded-lg bg-gray-200 cursor-not-allowed"
          />
          <select
            value={parity}
            onChange={(e) => setParity(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">Protection Level</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <input
            type="text"
            value={spare}
            onChange={(e) => setSpare(e.target.value)}
            placeholder="Virtual Hot Spare"
            className="p-2 border rounded-lg"
          />
        </div>
        <div className="flex flex-col space-y-4 bg-white border border-[#7A1FA2] p-4 rounded-lg text-[#7A1FA2]">
                    {rawTotal !== null && <p className="text-lg">Total Raw Capacity TB: <span className="font-bold">{rawTotal.split(': ')[1]}</span></p>}
          {usableCapacity !== null && <p className="text-lg">Total Usable Capacity TB: <span className="font-bold">{usableCapacity.split(': ')[1]}</span></p>}
          {result !== null && <p className="text-lg">Total Number of drives: <span className="font-bold">{result.split(': ')[1]}</span></p>}
          {efficiency !== null && rawTotal !== null && usableCapacity !== null && <p className="text-lg">Efficiency: <span className="font-bold">{efficiency.split(': ')[1]}</span></p>}
        </div>
      </div>
    </div>
  );
}
