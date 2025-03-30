import React, { useState, useEffect } from 'react';

export default function CalculatorApp() {
  const [numServers, setNumServers] = useState('');
  const [numNVMe, setNumNVMe] = useState('');
  const [nvmeSize, setNvmeSize] = useState('');
  const [data, setData] = useState('');
  const [parity, setParity] = useState('');
  const [spare, setSpare] = useState('');
  const [result, setResult] = useState(null);
  const [rawPerNode, setRawPerNode] = useState(null);
  const [rawTotal, setRawTotal] = useState(null);
  const [usableCapacity, setUsableCapacity] = useState(null);

  useEffect(() => {
    const servers = parseFloat(numServers);
    const nvme = parseFloat(numNVMe);
    const size = parseFloat(nvmeSize);
    const dataValue = parseFloat(data);
    const parityValue = parseFloat(parity);
    const spareValue = parseFloat(spare);

    let totalDrives = null;
    let rawPerNodeCapacity = null;
    let rawTotalCapacity = null;
    let totalUsableCapacity = null;

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

    setResult(totalDrives !== null ? `Total Number of drives: ${totalDrives.toLocaleString()}` : null);
    setRawPerNode(rawPerNodeCapacity !== null ? `Raw Per Node Capacity TB: ${rawPerNodeCapacity.toLocaleString()}` : null);
    setRawTotal(rawTotalCapacity !== null ? `Raw Total Capacity TB: ${rawTotalCapacity.toLocaleString()}` : null);
    setUsableCapacity(totalUsableCapacity !== null ? `Total Usable Capacity TB: ${totalUsableCapacity.toFixed(2)}` : null);
  }, [numServers, numNVMe, nvmeSize, data, parity, spare]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Capacity Calculator</h1>
      <div className="flex">
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
          <select
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">Select Data Stripe</option>
            {Array.from({ length: 12 }, (_, i) => i + 5).map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
          <select
            value={parity}
            onChange={(e) => setParity(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">Select Parity</option>
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
        <div className="flex flex-col space-y-4">
          {result !== null && <p className="text-lg">{result}</p>}
          {rawPerNode !== null && <p className="text-lg">{rawPerNode}</p>}
          {rawTotal !== null && <p className="text-lg">{rawTotal}</p>}
          {usableCapacity !== null && <p className="text-lg">{usableCapacity}</p>}
        </div>
      </div>
    </div>
  );
}
