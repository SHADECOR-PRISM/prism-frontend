import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PieChart, Pie, Cell, ResponsiveContainer, type PieLabelRenderProps } from 'recharts';

export interface StatusCounts {
  approved: number;
  pending: number;
  rejected: number;
}

interface StatusPieChartCardProps {
  data?: StatusCounts;
}

// UI画像に合わせたカラーパレット（青系のグラデーション）
const STATUS_CONFIG = [
  { key: 'pending', label: 'Pending', color: '#2F65CB' },
  { key: 'approved', label: 'Approved', color: '#5B9BD5' },
  { key: 'rejected', label: 'Rejected', color: '#1F3A70' },
] as const;

export default function StatusPieChartCard({
  data = { pending: 0, approved: 0, rejected: 0 },
}: StatusPieChartCardProps) {
  const pendingCount = data?.pending ?? 0;
  const approvedCount = data?.approved ?? 0;
  const rejectedCount = data?.rejected ?? 0;
  const total = pendingCount + approvedCount + rejectedCount;

  // データが全件0件の場合はグレーの空円を表示
  const hasData = total > 0;
  const chartData = hasData
    ? [
        { name: 'Pending', value: pendingCount, color: '#2F65CB' },
        { name: 'Approved', value: approvedCount, color: '#5B9BD5' },
        { name: 'Rejected', value: rejectedCount, color: '#1F3A70' },
      ]
    : [{ name: 'No Data', value: 1, color: '#E0E0E0' }];

  // パイチャート内部にパーセンテージを描画するカスタムラベル
  const renderCustomizedLabel = ({
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0,
  }: PieLabelRenderProps) => {
    if (!hasData || typeof percent !== 'number' || percent === 0) return null;
    const RADIAN = Math.PI / 180;
    const numInner = Number(innerRadius);
    const numOuter = Number(outerRadius);
    const numCx = Number(cx);
    const numCy = Number(cy);
    const numMidAngle = Number(midAngle);

    const radius = numInner + (numOuter - numInner) * 0.5;
    const x = numCx + radius * Math.cos(-numMidAngle * RADIAN);
    const y = numCy + radius * Math.sin(-numMidAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#FFFFFF"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="10px"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #E0E0E0',
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
      }}
    >
      {/* タイトル（下線アクセント付き） */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#000000',
            letterSpacing: '0.05em',
          }}
        >
          承認データ数
        </Typography>
        <Box
          sx={{
            position: 'absolute',
            bottom: -2,
            left: 0,
            right: 0,
            height: '3px',
            bgcolor: '#007BFF',
            borderRadius: '2px',
          }}
        />
      </Box>

      {/* チャート + 凡例内訳 */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* ドーナツチャート */}
        <Box sx={{ width: 170, height: 170, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={75}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
                stroke="#FFFFFF"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* データが 0 件のときの中央テキスト */}
          {!hasData && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <Typography sx={{ fontSize: '11px', color: '#888888', fontWeight: 'bold' }}>
                データなし
              </Typography>
            </Box>
          )}
        </Box>

        {/* 右側：内訳リスト */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pr: 1 }}>
          {STATUS_CONFIG.map((item) => {
            const count = (data && data[item.key as keyof StatusCounts]) ?? 0;
            return (
              <Box
                key={item.key}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  minWidth: 140,
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ fontSize: '13px', color: '#444444', fontWeight: 500 }}>
                    {item.label}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: '#000000' }}>
                  {count.toLocaleString()}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}