
export enum ProtocolType {
  TCP = 'tcp',
  UDP = 'udp',
  ICMP = 'icmp'
}

export enum ServiceType {
  HTTP = 'http',
  FTP = 'ftp',
  SMTP = 'smtp',
  DNS = 'dns',
  TELNET = 'telnet'
}

export enum FlagType {
  SF = 'SF',
  S0 = 'S0',
  REJ = 'REJ',
  RSTR = 'RSTR'
}

export type ThreatLabel = 'normal' | 'neptune' | 'smurf' | 'backdoor' | 'teardrop' | 'pod';

export interface NetworkPacket {
  id: string;
  timestamp: string;
  duration: number;
  protocol_type: ProtocolType;
  service: ServiceType;
  flag: FlagType;
  src_bytes: number;
  dst_bytes: number;
  label: ThreatLabel;
  risk_score: number; // 0 to 100
  analysis?: string;
}

export interface Stats {
  totalScanned: number;
  threatsDetected: number;
  averageRisk: number;
  lastUpdate: string;
}
