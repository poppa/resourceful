export const columns = (): null => {
  requestAnimationFrame((): void => {
    const resources = document.querySelectorAll<HTMLDivElement>('.resource')

    if (!resources || !resources.length) {
      return
    }

    let colWidth = NaN
    const margin = 15
    const cols: Array<{ low: number; high: number; r: HTMLDivElement[] }> = []

    const findColumn = (low: number, high: number): HTMLDivElement[] => {
      if (isNaN(colWidth)) {
        throw new Error('No column width determined')
      }

      for (const c of cols) {
        if (
          (c.low === low && c.high === high) ||
          (low > c.low && low < c.high) ||
          (low < c.low && high > c.low)
        ) {
          return c.r
        }
      }

      const r: HTMLDivElement[] = []
      cols.push({ low, high, r })
      return r
    }

    // Have no idea why TS doesn't think resources has an iterator???
    //
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    for (const res of resources) {
      if (isNaN(colWidth)) {
        colWidth = res.offsetWidth + margin
      }

      const y = res.offsetLeft
      const col = findColumn(y, y + res.offsetWidth)
      col.push(res)
    }

    for (const col of cols) {
      let top = 0

      const rr = col.r.sort((a, b) => {
        const aTop = parseInt(a.style.top, 10)
        const bTop = parseInt(b.style.top, 10)
        return aTop - bTop
      })

      for (const r of rr) {
        r.style.position = 'absolute'
        r.style.left = `${col.low}px`
        r.style.top = `${top}px`

        top += r.offsetHeight + margin
      }
    }
  })

  return null
}
