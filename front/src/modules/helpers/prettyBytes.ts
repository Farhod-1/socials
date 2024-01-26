const options = {
  thousandsSeparator: ',',
  unitSeparator: ' ',
  unitCount: 2,
  units: ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
}

export function prettyBytes(bytes: number): string {
  if (Number.isNaN(bytes)) {
    return '0'
  }

  if (bytes < 1) {
    const number = (bytes === 0 ? 0 : bytes.toPrecision(3)).toString()
    return number + options.unitSeparator + options.units[0]
  }

  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1000)), options.units.length - 1)
  bytes = Number((bytes / Math.pow(1000, exponent)).toPrecision(3))
  const unit = options.units[exponent]

  return (
    bytes.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      useGrouping: true
    }) +
    options.unitSeparator +
    unit
  )
}
