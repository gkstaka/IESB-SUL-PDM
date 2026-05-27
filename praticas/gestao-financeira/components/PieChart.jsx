import { StyleSheet, Text, View } from "react-native"
import Svg, { Circle, G, Path } from "react-native-svg"
import { colors } from "../constants/colors"

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function slicePath(cx, cy, r, startAngle, endAngle) {
  const s = polarToCartesian(cx, cy, r, startAngle)
  const e = polarToCartesian(cx, cy, r, endAngle)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`
}

export default function PieChart({ data, size = 220 }) {
  const comValor = data.filter((d) => d.value > 0)
  if ((comValor.length === 0)) {
    return (
      <View style={[styles.empty, { height: size }]}>
        <Text style={styles.emptyText}>Sem dados no período</Text>
      </View>
    )
  }

  var total = comValor.reduce((s, d) => s + d.value, 0)
  const cx = size / 2
  const cy = size / 2

  const r  = size / 2 - 8

  let angle = 0
  const slices = comValor.map((d) => {
    const porcentagem = d.value / total
    const sweep = porcentagem * 360
    const path  = slicePath(cx, cy, r, angle, angle + sweep)
    angle += sweep
    return { ...d, path }
  })

  return (
    <View style={styles.wrapper}>
      <Svg width={size} height={size}>
        <G>
          {slices.length === 1
            ? <Circle cx={cx} cy={cy} r={r} fill={slices[0].color} />
            : slices.map((s, i) => (
                <Path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth={2} />
              ))
          }
        </G>
      </Svg>

      <View style={styles.legend}>
        {slices.map((s, i) => (
          <View key={i} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <Text style={styles.legendLabel} numberOfLines={1}>{s.label}</Text>
            <Text style={styles.legendValue}>
              {s.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginVertical: 8,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: colors.secondaryText,
    fontSize: 14,
  },
  legend: {
    width: "100%",
    marginTop: 16,
    gap: 6,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.primaryText,
  },
  legendValue: {
    fontSize: 14,
    color: colors.primaryText,
    fontWeight: "600",
  },
})
