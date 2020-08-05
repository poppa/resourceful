export const columns = (): null => {
  requestAnimationFrame((): void => {
    const resources = document.querySelectorAll<HTMLDivElement>('.resource')

    if (!resources || !resources.length) {
      return
    }

    const height =
      document.querySelector<HTMLDivElement>('.outer-canvas')?.offsetHeight ??
      NaN

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

      const x = res.offsetLeft
      const col = findColumn(x, x + res.offsetWidth)
      col.push(res)
    }

    for (let i = 0; i < cols.length; i++) {
      const col = cols[i]
      let top = 0

      const rr = col.r.sort((a, b) => {
        const aTop = parseInt(a.style.top, 10)
        const bTop = parseInt(b.style.top, 10)

        if (isNaN(aTop) && isNaN(bTop)) {
          return 0
        } else if (isNaN(aTop)) {
          return 1
        } else if (isNaN(bTop)) {
          return -1
        }

        return aTop - bTop
      })

      for (const r of rr) {
        r.style.position = 'absolute'
        r.style.left = `${col.low}px`
        r.style.top = `${top}px`

        if (top > height) {
          if (!cols[i + 1]) {
            cols.push({
              low: col.high + margin,
              high: col.high + margin + colWidth,
              r: [],
            })
          }

          cols[i + 1].r.push(r)

          continue
        }

        top += r.offsetHeight + margin
      }
    }
  })

  return null
}
