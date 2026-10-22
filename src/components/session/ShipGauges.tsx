import { Html } from '@react-three/drei';

import type { BotView } from '../../engine/model';
import { RULES } from '../../engine/rules';

export type RechargeKind = 'fuel' | 'repair';

export default function ShipGauges({ bot, recharging, paused }: { bot: BotView; recharging: RechargeKind | null; paused: boolean }) {
  const gauges = [
    { kind: 'fuel', value: bot.fuel, max: RULES.fuelCapacity },
    { kind: 'repair', value: bot.damage, max: 100 },
  ] as const;

  return <Html center position={[0, 0.88, 0]} zIndexRange={[3, 0]} className="ship-gauges-anchor">
    <div className="ship-gauges" aria-label={`Jauges du Bot ${bot.id.slice(-1)}`}>
      {gauges.map(gauge => <div key={gauge.kind}
        className={`ship-gauge ship-gauge--${gauge.kind}${recharging === gauge.kind ? ' is-recharging' : ''}${paused ? ' is-paused' : ''}`}
        role="meter" aria-label={`${gauge.kind === 'fuel' ? 'Carburant' : 'Dégâts'} du Bot ${bot.id.slice(-1)}`}
        aria-valuemin={0} aria-valuemax={gauge.max} aria-valuenow={gauge.value} aria-valuetext={`${gauge.value} %`}>
        <span className="ship-gauge-track" aria-hidden="true"><span className="ship-gauge-fill" style={{ width: `${Math.max(0, Math.min(100, gauge.value / gauge.max * 100))}%` }} /></span>
      </div>)}
    </div>
  </Html>;
}
