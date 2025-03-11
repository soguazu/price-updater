'use client';

import 'react-toastify/dist/ReactToastify.css';

import { AnimatePresence, motion } from 'framer-motion';
import { CalendarIcon, Check, DollarSign, Save } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToastContainer, toast } from 'react-toastify';
import { addDays, format, isAfter, isSameMonth, startOfDay } from 'date-fns';
import {
  updateMultipleDatePrice,
  updateSingleDatePrice as updateSingleDatePriceApi,
} from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type React from 'react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Define the price data structure
type PriceData = {
  [date: string]: number;
};

export default function PricingCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [singlePrice, setSinglePrice] = useState<string>('0');
  const [rangePrice, setRangePrice] = useState<string>('0');
  const [priceData, setPriceData] = useState<PriceData>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [singleDateOpen, setSingleDateOpen] = useState(false);
  const [rangeDateOpen, setRangeDateOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [basePrice, setBasePrice] = useState<number>(0);

  // Function to calculate pricing summary for single date
  const calculateSinglePricingSummary = () => {
    const currentPrice = Number.parseInt(singlePrice) || 0;
    const existingCustomPrices = Object.values(priceData);

    // If no price is entered and no custom prices exist, return all zeros
    if (currentPrice === 0 && existingCustomPrices.length === 0) {
      return {
        basePrice: 0,
        customPrices: 0,
      };
    }

    // If a price is being entered but not saved yet
    if (currentPrice > 0 && date) {
      return {
        basePrice: currentPrice,
        customPrices: 1,
      };
    }

    // For existing saved prices
    return {
      basePrice: basePrice,
      customPrices: existingCustomPrices.length,
    };
  };

  // Function to calculate pricing summary for range
  const calculateRangePricingSummary = () => {
    const currentPrice = Number.parseInt(rangePrice) || 0;

    // If no price is entered and no dates selected, return all zeros
    if (currentPrice === 0 && (!dateRange.from || !dateRange.to)) {
      return {
        basePrice: 0,
        customPrices: 0,
      };
    }

    let daysInRange = 0;

    if (dateRange.from && dateRange.to && currentPrice > 0) {
      let currentDate = startOfDay(dateRange.from);
      const endDate = startOfDay(dateRange.to);

      while (!isAfter(currentDate, endDate)) {
        daysInRange++;
        currentDate = addDays(currentDate, 1);
      }

      return {
        basePrice: currentPrice,
        customPrices: daysInRange,
      };
    }

    return {
      basePrice: currentPrice,
      customPrices: 0,
    };
  };

  // Function to update a single date price
  const updateSingleDatePrice = async () => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      toast.error('Please select a valid date');
      return;
    }

    const dateString = format(date, 'yyyy-MM-dd');
    const newPrice = Number.parseInt(singlePrice);

    if (isNaN(newPrice) || newPrice <= 0) {
      toast.error('Please enter a valid price greater than 0');
      return;
    }

    try {
      await updateSingleDatePriceApi(dateString, newPrice);

      // Reset all states after successful update
      setPriceData({});
      setBasePrice(0);
      setSinglePrice('0');
      setDate(undefined);

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // If the updated date is in the current month view, update the current month to show it
      if (isSameMonth(date, currentMonth)) {
        setCurrentMonth(new Date(date));
      }

      toast.success('Price updated successfully');
    } catch (error) {
      console.error('Failed to update price:', error);
      toast.error('Failed to update price');
    }
  };

  // Update the updateDateRangePrice function to ensure dates are valid
  const updateDateRangePrice = async () => {
    if (
      !dateRange.from ||
      !dateRange.to ||
      !(dateRange.from instanceof Date) ||
      !(dateRange.to instanceof Date) ||
      isNaN(dateRange.from.getTime()) ||
      isNaN(dateRange.to.getTime())
    ) {
      toast.error('Please select both start and end dates');
      return;
    }

    const newPrice = Number.parseInt(rangePrice);

    if (isNaN(newPrice) || newPrice <= 0) {
      toast.error('Please enter a valid price greater than 0');
      return;
    }

    try {
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      const endDate = format(dateRange.to, 'yyyy-MM-dd');

      await updateMultipleDatePrice(startDate, endDate, newPrice);

      // Reset all states after successful update
      setPriceData({});
      setBasePrice(0);
      setRangePrice('0');
      setDateRange({ from: undefined, to: undefined });

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // If the range includes the current month view, update the current month to show it
      if (dateRange.from && isSameMonth(dateRange.from, currentMonth)) {
        setCurrentMonth(new Date(dateRange.from));
      }

      toast.success('Prices updated successfully');
    } catch (error) {
      console.error('Failed to update prices:', error);
      toast.error('Failed to update prices');
    }
  };

  return (
    <>
      <div className="flex justify-center min-h-fit w-[50%]">
        <Card className="w-full">
          <CardHeader className="bg-[#E36B37]/5">
            <CardTitle>Update Pricing</CardTitle>
            <CardDescription>Set new prices for selected dates</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs
              defaultValue="single"
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="single">Single Date</TabsTrigger>
                <TabsTrigger value="range">Date Range</TabsTrigger>
              </TabsList>

              <TabsContent
                value="single"
                className="space-y-4 mt-0"
              >
                <div className="space-y-2">
                  <Label htmlFor="selected-date">Selected Date</Label>
                  <Popover
                    open={singleDateOpen}
                    onOpenChange={setSingleDateOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          setDate(newDate);
                          setSingleDateOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="single-price">Price per Night ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="single-price"
                      type="number"
                      value={singlePrice}
                      onChange={(e) => setSinglePrice(e.target.value)}
                      className="pl-9"
                      min="1"
                    />
                  </div>
                </div>

                <Card>
                  <CardHeader className="bg-[#E36B37]/5">
                    <CardTitle>Pricing Summary</CardTitle>
                    <CardDescription>
                      Overview of your pricing changes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Base price:</span>
                        <span className="text-sm">
                          ${calculateSinglePricingSummary().basePrice}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          Custom prices:
                        </span>
                        <span className="text-sm">
                          {calculateSinglePricingSummary().customPrices} days
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-2"
                >
                  <Button
                    onClick={updateSingleDatePrice}
                    className="w-full bg-[#E36B37] hover:bg-[#E36B37]/90"
                    disabled={!date}
                  >
                    <AnimatePresence mode="wait">
                      {showSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center"
                        >
                          <Check className="mr-2 h-4 w-4" /> Updated
                        </motion.div>
                      ) : (
                        <motion.div
                          key="save"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center"
                        >
                          <Save className="mr-2 h-4 w-4" /> Save Price
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </TabsContent>

              <TabsContent
                value="range"
                className="space-y-4 mt-0"
              >
                <div className="space-y-2">
                  <Label>Selected Range</Label>
                  <Popover
                    open={rangeDateOpen}
                    onOpenChange={setRangeDateOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !dateRange.from && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from && dateRange.to
                          ? `${format(dateRange.from, 'MMM d')} - ${format(
                              dateRange.to,
                              'MMM d, yyyy'
                            )}`
                          : 'Select a date range'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={(range) => {
                          if (range) {
                            setDateRange({ from: range.from, to: range.to });
                          }
                        }}
                        numberOfMonths={2}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="range-price">Base Price per Night ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="range-price"
                      type="number"
                      value={rangePrice}
                      onChange={(e) => setRangePrice(e.target.value)}
                      className="pl-9"
                      min="1"
                    />
                  </div>
                </div>

                <Card>
                  <CardHeader className="bg-[#E36B37]/5">
                    <CardTitle>Pricing Summary</CardTitle>
                    <CardDescription>
                      Overview of your pricing changes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Base price:</span>
                        <span className="text-sm">
                          ${calculateRangePricingSummary().basePrice}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          Custom prices:
                        </span>
                        <span className="text-sm">
                          {calculateRangePricingSummary().customPrices} days
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-2"
                >
                  <Button
                    onClick={updateDateRangePrice}
                    className="w-full bg-[#E36B37] hover:bg-[#E36B37]/90"
                    disabled={!dateRange.from || !dateRange.to}
                  >
                    <AnimatePresence mode="wait">
                      {showSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center"
                        >
                          <Check className="mr-2 h-4 w-4" /> Updated
                        </motion.div>
                      ) : (
                        <motion.div
                          key="save"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center"
                        >
                          <Save className="mr-2 h-4 w-4" /> Save Prices
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
