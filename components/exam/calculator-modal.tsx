"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type CalculatorModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CalculatorModal({ open, onOpenChange }: CalculatorModalProps) {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [newNumber, setNewNumber] = useState(true)

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num)
      setNewNumber(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const handleOperation = (op: string) => {
    const current = Number.parseFloat(display)
    if (previousValue === null) {
      setPreviousValue(current)
    } else if (operation) {
      const result = calculate(previousValue, current, operation)
      setDisplay(String(result))
      setPreviousValue(result)
    }
    setOperation(op)
    setNewNumber(true)
  }

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+":
        return a + b
      case "-":
        return a - b
      case "×":
        return a * b
      case "÷":
        return a / b
      default:
        return b
    }
  }

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const result = calculate(previousValue, Number.parseFloat(display), operation)
      setDisplay(String(result))
      setPreviousValue(null)
      setOperation(null)
      setNewNumber(true)
    }
  }

  const handleClear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setNewNumber(true)
  }

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".")
      setNewNumber(false)
    }
  }

  const buttonClass = "h-14 text-lg font-medium"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Calculator</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-right">
            <div className="font-mono text-3xl font-semibold">{display}</div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" onClick={handleClear} className={buttonClass}>
              AC
            </Button>
            <Button
              variant="outline"
              onClick={() => setDisplay(String(-Number.parseFloat(display)))}
              className={buttonClass}
            >
              +/-
            </Button>
            <Button
              variant="outline"
              onClick={() => setDisplay(String(Number.parseFloat(display) / 100))}
              className={buttonClass}
            >
              %
            </Button>
            <Button variant="default" onClick={() => handleOperation("÷")} className={buttonClass}>
              ÷
            </Button>

            <Button variant="outline" onClick={() => handleNumber("7")} className={buttonClass}>
              7
            </Button>
            <Button variant="outline" onClick={() => handleNumber("8")} className={buttonClass}>
              8
            </Button>
            <Button variant="outline" onClick={() => handleNumber("9")} className={buttonClass}>
              9
            </Button>
            <Button variant="default" onClick={() => handleOperation("×")} className={buttonClass}>
              ×
            </Button>

            <Button variant="outline" onClick={() => handleNumber("4")} className={buttonClass}>
              4
            </Button>
            <Button variant="outline" onClick={() => handleNumber("5")} className={buttonClass}>
              5
            </Button>
            <Button variant="outline" onClick={() => handleNumber("6")} className={buttonClass}>
              6
            </Button>
            <Button variant="default" onClick={() => handleOperation("-")} className={buttonClass}>
              -
            </Button>

            <Button variant="outline" onClick={() => handleNumber("1")} className={buttonClass}>
              1
            </Button>
            <Button variant="outline" onClick={() => handleNumber("2")} className={buttonClass}>
              2
            </Button>
            <Button variant="outline" onClick={() => handleNumber("3")} className={buttonClass}>
              3
            </Button>
            <Button variant="default" onClick={() => handleOperation("+")} className={buttonClass}>
              +
            </Button>

            <Button variant="outline" onClick={() => handleNumber("0")} className={`${buttonClass} col-span-2`}>
              0
            </Button>
            <Button variant="outline" onClick={handleDecimal} className={buttonClass}>
              .
            </Button>
            <Button variant="default" onClick={handleEquals} className={buttonClass}>
              =
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
