import React, { useState, useEffect } from 'react'
import { DatePicker, DayOfWeek, IDatePicker, IDatePickerStrings } from '@fluentui/react/lib/DatePicker'
import { mergeStyleSets, setIconOptions } from '@fluentui/react/lib/Styling'
import { initializeIcons } from '@fluentui/react/lib/Icons'

// Suppress office UI fabric icon warnings.
initializeIcons(undefined, { disableWarnings: true })

const DayPickerStrings: IDatePickerStrings = {
  months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

  shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

  days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],

  shortDays: ['日', '一', '二', '三', '四', '五', '六'],

  goToToday: '今天',
  prevMonthAriaLabel: '上一个月',
  nextMonthAriaLabel: '下一个月',
  prevYearAriaLabel: '上一年',
  nextYearAriaLabel: '下一年',
  closeButtonAriaLabel: '关闭',
  monthPickerHeaderAriaLabel: '{0}, 选择月份',
  yearPickerHeaderAriaLabel: '{0}, 选择年份',

  isRequiredErrorMessage: '起始日期是必须的.',

  invalidInputErrorMessage: '日期格式错误.',
}

const firstDayOfWeek = DayOfWeek.Sunday

const desc = '日期仅支持年月日'

const controlClass = mergeStyleSets({
  control: {
    margin: '0 0 15px 0',
	width: '100%'
    // maxWidth: '400px',
  },
})

export interface IControlProps {
  dateOfPicker: Date | null | undefined
  disabled: boolean
  valueChanged?: (newValue: Date | null | undefined) => void
}

export const ControlComponent: React.FC<IControlProps> = (props) => {
  const [dateOfPicker, setDateOfPicker] = useState(props.dateOfPicker)

  useEffect(() => {
    setDateOfPicker(props.dateOfPicker)
  }, [props.dateOfPicker])

  const datePickerRef = React.useRef<IDatePicker>(null)

  const onSelectDate = (date: Date | null | undefined): void => {
    setDateOfPicker(date)
    if (props.valueChanged) {
      props.valueChanged(date)
    }
  }

  const onParseDateFromString = (val: string): Date => {
    const date = dateOfPicker || new Date()
    const values = (val || '').trim().split('/')
    const day = val.length > 0 ? Math.max(1, Math.min(31, parseInt(values[0], 10))) : date.getDate()
    const month = val.length > 1 ? Math.max(1, Math.min(12, parseInt(values[1], 10))) - 1 : date.getMonth()
    let year = val.length > 2 ? parseInt(values[2], 10) : date.getFullYear()
    if (year < 100) {
      year += date.getFullYear() - (date.getFullYear() % 100)
    }
    return new Date(year, month, day)
  }

  const onFormatDate = (date?: Date): string => {
    return !date ? '' : date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
  }

  return (
      <div className={'control'}>
        <DatePicker
          componentRef={datePickerRef}
          className={controlClass.control}
          showGoToToday={true}
          highlightCurrentMonth={true}
          highlightSelectedMonth={true}
          label=""
          isRequired={false}
          allowTextInput={true}
		  disabled={props.disabled}
          ariaLabel={desc}
          firstDayOfWeek={firstDayOfWeek}
          strings={DayPickerStrings}
          value={dateOfPicker!}
          // eslint-disable-next-line react/jsx-no-bind
          onSelectDate={onSelectDate}
          formatDate={onFormatDate}
          // eslint-disable-next-line react/jsx-no-bind
          parseDateFromString={onParseDateFromString}
        />
      </div>
  )
}
