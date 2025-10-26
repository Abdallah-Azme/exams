"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ReferenceSheetModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReferenceSheetModal({ open, onOpenChange }: ReferenceSheetModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Reference Sheet</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="math" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="math">Math Formulas</TabsTrigger>
            <TabsTrigger value="constants">Constants</TabsTrigger>
          </TabsList>
          <TabsContent value="math">
            <ScrollArea className="h-96">
              <div className="space-y-6 pr-4">
                <div>
                  <h3 className="mb-2 font-semibold">Geometry</h3>
                  <div className="space-y-2 text-sm">
                    <div className="rounded-md bg-muted p-3">
                      <p className="font-medium">Area of a circle:</p>
                      <p className="font-mono">A = πr²</p>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="font-medium">Circumference of a circle:</p>
                      <p className="font-mono">C = 2πr</p>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="font-medium">Area of a rectangle:</p>
                      <p className="font-mono">A = lw</p>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="font-medium">Area of a triangle:</p>
                      <p className="font-mono">A = ½bh</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Algebra</h3>
                  <div className="space-y-2 text-sm">
                    <div className="rounded-md bg-muted p-3">
                      <p className="font-medium">Pythagorean theorem:</p>
                      <p className="font-mono">a² + b² = c²</p>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="font-medium">Quadratic formula:</p>
                      <p className="font-mono">x = (-b ± √(b² - 4ac)) / 2a</p>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="font-medium">Slope formula:</p>
                      <p className="font-mono">m = (y₂ - y₁) / (x₂ - x₁)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Volume</h3>
                  <div className="space-y-2 text-sm">
                    <div className="rounded-md bg-muted p-3">
                      <p className="font-medium">Volume of a rectangular solid:</p>
                      <p className="font-mono">V = lwh</p>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="font-medium">Volume of a cylinder:</p>
                      <p className="font-mono">V = πr²h</p>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="font-medium">Volume of a sphere:</p>
                      <p className="font-mono">V = (4/3)πr³</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="constants">
            <ScrollArea className="h-96">
              <div className="space-y-4 pr-4">
                <div className="rounded-md bg-muted p-4">
                  <p className="font-medium">Pi (π)</p>
                  <p className="font-mono text-lg">3.14159...</p>
                </div>
                <div className="rounded-md bg-muted p-4">
                  <p className="font-medium">Euler's number (e)</p>
                  <p className="font-mono text-lg">2.71828...</p>
                </div>
                <div className="rounded-md bg-muted p-4">
                  <p className="font-medium">Golden ratio (φ)</p>
                  <p className="font-mono text-lg">1.61803...</p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
