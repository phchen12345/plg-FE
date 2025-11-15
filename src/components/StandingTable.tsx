"use client";

import Image from "next/image";
import styles from "./standing.module.scss";

const standings = [
  {
    rank: 1,
    teamName: "領航猿",
    logo: "/pilots.png",
    gp: 2,
    win: 2,
    loss: 0,
    pct: "100%",
    diff: 0,
    ptsFor: 106.5,
    ptsAgainst: 92.5,
    margin: 14,
    home: "2-0",
    away: "-",
    streak: "W2",
    last10: "2-0",
  },
  {
    rank: 2,
    teamName: "獵鷹",
    logo: "/GhostHawks.png",
    gp: 2,
    win: 1,
    loss: 1,
    pct: "50%",
    diff: 1,
    ptsFor: 100.5,
    ptsAgainst: 88.5,
    margin: 12,
    home: "-",
    away: "1-1",
    streak: "W1",
    last10: "1-1",
  },
  {
    rank: 3,
    teamName: "勇士",
    logo: "/braves.png",
    gp: 3,
    win: 1,
    loss: 2,
    pct: "33%",
    diff: 1.5,
    ptsFor: 101.7,
    ptsAgainst: 110,
    margin: -8.3,
    home: "1-1",
    away: "0-1",
    streak: "W1",
    last10: "1-2",
  },
  {
    rank: 4,
    teamName: "洋基工程",
    logo: "/yankees.png",
    gp: 1,
    win: 0,
    loss: 1,
    pct: "0%",
    diff: 1.5,
    ptsFor: 106,
    ptsAgainst: 133,
    margin: -27,
    home: "-",
    away: "0-1",
    streak: "L1",
    last10: "0-1",
  },
];

export default function StandingTable() {
  return (
    <section className={styles.standing}>
      <div className="flex justify-between gap-3 mb-6 mt-10 w-full">
        <div className="inline-flex gap-2.5 items-baseline">
          <p className={`text-[24px] ${styles["standing-title"]}`}>
            STANDINGS & RANKINGS
          </p>
          <p className="text-[16px] font-bold title-zh">/ 例行賽 /</p>
        </div>
        <i className="bi bi-chevron-right"></i>
      </div>
      <p className={styles.p1}>戰績排行</p>

      <table>
        <thead>
          <tr>
            <th>排行</th>
            <th>球隊</th>
            <th>已賽 GP</th>
            <th>勝 W</th>
            <th>敗 L</th>
            <th>勝率 PCT</th>
            <th>勝差</th>
            <th>平均得分</th>
            <th>平均失分</th>
            <th>平均分差</th>
            <th>主場</th>
            <th>客場</th>
            <th>連勝連敗</th>
            <th>近10場比賽</th>
          </tr>
        </thead>

        <tbody>
          {standings.map((team) => (
            <tr key={team.rank}>
              <td>{team.rank}</td>
              <td>
                <div className={styles.teamCell}>
                  <Image
                    src={team.logo}
                    alt={team.teamName}
                    width={38}
                    height={38}
                  />
                  <span>{team.teamName}</span>
                </div>
              </td>
              <td>{team.gp}</td>
              <td>{team.win}</td>
              <td>{team.loss}</td>
              <td>{team.pct}</td>
              <td>{team.diff}</td>
              <td>{team.ptsFor}</td>
              <td>{team.ptsAgainst}</td>
              <td>{team.margin}</td>
              <td>{team.home}</td>
              <td>{team.away}</td>
              <td>{team.streak}</td>
              <td>{team.last10}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
