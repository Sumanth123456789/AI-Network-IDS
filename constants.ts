
import { ProtocolType, ServiceType, FlagType, ThreatLabel, NetworkPacket } from './types';

export const THREAT_COLORS: Record<ThreatLabel, string> = {
  normal: 'text-green-400',
  neptune: 'text-red-500',
  smurf: 'text-orange-500',
  backdoor: 'text-purple-500',
  teardrop: 'text-pink-500',
  pod: 'text-yellow-500'
};

export const THREAT_BG_COLORS: Record<ThreatLabel, string> = {
  normal: 'bg-green-500/10',
  neptune: 'bg-red-500/10',
  smurf: 'bg-orange-500/10',
  backdoor: 'bg-purple-500/10',
  teardrop: 'bg-pink-500/10',
  pod: 'bg-yellow-500/10'
};

export const MOCK_SERVICES = [ServiceType.HTTP, ServiceType.FTP, ServiceType.SMTP, ServiceType.DNS, ServiceType.TELNET];
export const MOCK_PROTOCOLS = [ProtocolType.TCP, ProtocolType.UDP, ProtocolType.ICMP];
export const MOCK_FLAGS = [FlagType.SF, FlagType.S0, FlagType.REJ, FlagType.RSTR];

export const generateMockPacket = (): NetworkPacket => {
  const isAttack = Math.random() > 0.8;
  const attackTypes: ThreatLabel[] = ['neptune', 'smurf', 'backdoor', 'teardrop', 'pod'];
  const label = isAttack ? attackTypes[Math.floor(Math.random() * attackTypes.length)] : 'normal';
  
  return {
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toLocaleTimeString(),
    duration: Math.floor(Math.random() * 1000),
    protocol_type: MOCK_PROTOCOLS[Math.floor(Math.random() * MOCK_PROTOCOLS.length)],
    service: MOCK_SERVICES[Math.floor(Math.random() * MOCK_SERVICES.length)],
    flag: MOCK_FLAGS[Math.floor(Math.random() * MOCK_FLAGS.length)],
    src_bytes: Math.floor(Math.random() * 5000),
    dst_bytes: Math.floor(Math.random() * 5000),
    label,
    risk_score: isAttack ? Math.floor(Math.random() * 50) + 50 : Math.floor(Math.random() * 20)
  };
};
