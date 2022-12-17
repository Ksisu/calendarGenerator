import React, {useMemo} from 'react';
import * as _ from "lodash";
import styled from 'styled-components'
import {getNames} from "./namedays";


const MonthWrapper = styled.div`
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`

const MonthHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

const MonthLabel = styled.div`
  font-size: 70px;
  padding-bottom: 30px;
  padding-left: 20px;
`

const YearLabel = styled.div`
  font-size: 30px;
  padding-right: 10px;
  align-self: center;
`

const WeeksContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  flex: 1;
`

const WeekLabels = styled.div`
  display: flex;
`

const DayLabel = styled.div<{ isRed?: boolean }>`
  padding: 5px;
  flex: 1;
  font-weight: bold;
  text-align: center;
  ${props => props.isRed ? 'color: red' : ''}
`

const WeekWrapper = styled.div`
  display: flex;
  flex: 1;
`

const DayRoot = styled.div`
  border: 1px solid black;
  padding: 5px;
  flex: 1;
  display: flex;
  flex-direction: column;
`

const DayNumber = styled.div<{ isRed?: boolean; isPrePostfix?: boolean }>`
  font-size: xx-large;
  ${props => {
  if (props.isRed) {
    return props.isPrePostfix ? 'color: lightpink' : 'color: red';
  }
  return props.isPrePostfix ? 'color: lightgray' : '';
}}`

const DayName = styled.div`
  font-size: smaller;
  color: gray;
  font-style: italic;
`

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

interface DayData {
  jsDate: Date;
  isPrePostfix: boolean;
  isRed: boolean;
  date: number;
  names: string[];
}

const mLabel = [
  "Január",
  "Február",
  "Március",
  "Április",
  "Május",
  "Június",
  "Július",
  "Augusztus",
  "Szeptember",
  "Október",
  "November",
  "December",
]

const dLabel = [
  "Hétfő",
  "Kedd",
  "Szerda",
  "Csütörtök",
  "Péntek",
  "Szombat",
  "Vasárnap",
]

function calculateYear(year: number) {
  // months / weeks / days
  const data: DayData[][][] = _.range(0, 12).map(m => {
    const firstDay = new Date(year, m, 1).getDay() || 7
    const prefix = _.range(-(firstDay - 2), 1).map(i => {
      const jsDate = new Date(year, m, i);
      const date = jsDate.getDate();
      const isRed = jsDate.getDay() === 0;
      return {jsDate, date, isRed, isPrePostfix: true, names: []};
    });
    const days = _.range(1, getDaysInMonth(year, m) + 1).map(d => {
      const jsDate = new Date(year, m, d);
      const date = jsDate.getDate();
      const isRed = jsDate.getDay() === 0;
      const names = getNames(m + 1, date);
      return {jsDate, date, isRed, names, isPrePostfix: false};
    })
    const postfixSize = 42 - (prefix.length + days.length);
    const postfix = _.range(1, postfixSize + 1).map(d => {
      const jsDate = new Date(year, m + 1, d)
      const date = jsDate.getDate();
      const isRed = jsDate.getDay() === 0;
      return {jsDate, date, isRed, isPrePostfix: true, names: []};
    });
    return _.chunk([...prefix, ...days, ...postfix], 7)
  });

  return data;
}

function Day({day}: { day: DayData }) {
  return (
    <DayRoot>
      <DayNumber isRed={day.isRed} isPrePostfix={day.isPrePostfix}>{day.date}</DayNumber>
      {day.names.map(n => (<DayName key={n}>{n}</DayName>))}
    </DayRoot>
  )
}

function App() {
  const year = 2023;
  const data = useMemo(() => calculateYear(year), [year]);

  return (
    <>
      {data.map((weeks, m) => (
        <MonthWrapper key={`m_${m}`}>
          <MonthHeader>
            <MonthLabel>{mLabel[m]}</MonthLabel>
            <YearLabel>{year}</YearLabel>
          </MonthHeader>
          <WeekLabels>
            {dLabel.map((dl, di) => (<DayLabel key={`dl_${di}`} isRed={di === 6}>{dl}</DayLabel>))}
          </WeekLabels>
          <WeeksContainer>
            {weeks.map((w, wi) => (
              <WeekWrapper key={`m_${m}_w_${wi}`}>
                {w.map((d, di) => (
                  <Day
                    key={`m_${m}_w_${wi}_d_${di}`}
                    day={d}
                  />
                ))}
              </WeekWrapper>
            ))}
          </WeeksContainer>
        </MonthWrapper>
      ))}
    </>
  );
}

export default App;
