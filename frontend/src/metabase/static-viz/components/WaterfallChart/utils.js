import d3 from "d3";
import { formatDate } from "../../lib/dates";

const WATERFALL_TOTAL_X = "WATERFALL_TOTAL_X";

export const calculateWaterfallEntries = (data, accessors) => {
  let total = 0;

  const entries = data.map(datum => {
    const xValue = accessors.x(datum);
    const yValue = accessors.y(datum);

    const prevTotal = total;
    total += yValue;

    return {
      x: xValue,
      y: yValue,
      start: prevTotal,
      end: total,
    };
  });

  entries.push({
    x: WATERFALL_TOTAL_X,
    y: total,
    start: 0,
    end: total,
    isTotal: true,
  });

  return entries;
};

export const formatTimescaleWaterfallTick = (value, settings) =>
  value === WATERFALL_TOTAL_X ? "Total" : formatDate(value, settings?.x);

export const calculateWaterfallDomain = entries => {
  const values = entries.flatMap(entry => [entry.start, entry.end]);
  return d3.extent(values);
};

export const getWaterfallEntryColor = (entry, palette) => {
  if (entry.isTotal) {
    return palette.waterfallTotal;
  }

  return entry.y > 0 ? palette.waterfallPositive : palette.waterfallNegative;
};
