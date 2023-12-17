import { getTokens } from "@/app/utils/get-tokens"
import  styles from "./index.module.css";

export default async function Home() {
    const data = await getTokens(1, 1)
    return (
        <main className="min-h-screen p-24">
            <div className={`max-w-3xl mx-auto flex justify-between items-center border px-5 py-2 mb-16 ${styles.searchBox}`}>
                <input type="text" className={`grow h-12 rounded-xl px-5 py-4 ${styles.searchInput}`} placeholder="Please input token name..." />
                <button className={`w-40 h-10 rounded-3xl text-white ${styles.searchButton}`}>Search</button>
            </div>
            <div className={`w-full border px-5 py-4 ${styles.tableContainer}`}>
                <table className="table-auto w-full">
                    <thead className={`opacity-60 h-10 ${styles.tableHeader}`}>
                        <tr>
                            <th className="rounded-l-3xl">#</th>
                            <th>Name</th>
                            <th>Progress</th>
                            <th>Total Supply</th>
                            <th>Minted %</th>
                            <th>Holders</th>
                            <th className="rounded-r-3xl">Deploy Block</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.tokens.map((token, index) => {
                            const progressDoneWidth = token.progress / 100 * 200;
                            return (
                                <tr key={token.name} className={`h-24 border-b ${styles.tableRow}`}>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="text-center">{token.name}</td>
                                    <td className="h-24 flex justify-center items-center">
                                        <div className={`h-4 rounded-xl ${styles.progressAll}`} style={{width: 200}}>
                                            <div className={`h-4 rounded-xl ${styles.progressDone}`} style={{width: progressDoneWidth}}></div>
                                        </div>
                                    </td>
                                    <td className="text-center">{token.totalSupply}</td>
                                    <td className="text-center">{token.progress}%</td>
                                    <td className="text-center">{token.holder}</td>
                                    <td className="text-center">{token.deployedBlock}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </main>
    )
}
