import { runScan, summarizeScan } from "./scan.js";

const scan = await runScan();

console.log(`Base URL: ${scan.baseUrl}`);
console.log(`Routes scanned: ${scan.totalRoutes}`);
console.log(`Residual English entries: ${scan.totalResidualEntries}`);

for (const item of summarizeScan(scan).filter((entry) => entry.residualEntries > 0)) {
  console.log(`- ${item.route}: ${item.residualEntries}`);
}
