import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";

interface CalendarProps {
  visible: boolean;
  initialDate?: Date | null;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  restrictFutureDates?: boolean;
}

const getMonthDays = (year: number, month: number) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }
  while (daysArray.length % 7 !== 0) {
    daysArray.push(null);
  }
  return daysArray;
};

const Calendar: React.FC<CalendarProps> = ({
  visible,
  initialDate,
  onConfirm,
  onCancel,
  restrictFutureDates = true,
}) => {
  const { height, width } = useWindowDimensions();
  const today = new Date();
  // Safely handle invalid initialDate
  const validInitialDate = initialDate && !isNaN(initialDate.getTime()) ? initialDate : today;
  const initialYear = validInitialDate.getFullYear();
  const initialMonth = validInitialDate.getMonth();
  const [selectedDate, setSelectedDate] = useState<Date>(validInitialDate);
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [date, setDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const days = getMonthDays(currentYear, currentMonth);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const years = Array.from({ length: 201 }, (_, i) => 1900 + i);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    setCurrentYear((prev) => (currentMonth === 0 ? prev - 1 : prev));
  };

  const handleNextMonth = () => {
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    if (!restrictFutureDates || new Date(nextYear, nextMonth, 1) <= today) {
      setCurrentMonth(nextMonth);
      setCurrentYear(nextYear);
    }
  };

  const handleYearSelect = (year: number) => {
    const month = selectedDate.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const day = Math.min(selectedDate.getDate(), lastDay);
    const newDate = new Date(year, month, day);
    if (!restrictFutureDates || newDate <= today) {
      setSelectedDate(newDate);
      setCurrentYear(year);
    }
    setShowYearPicker(false);
  };

  const isDateDisabled = (year: number, month: number, day: number | null) => {
    if (day === null) return true;
    if (!restrictFutureDates) return false;
    const date = new Date(year, month, day);
    return date > today;
  };

  
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    container: {
      backgroundColor: "#111",
      borderRadius: 10,
      elevation: 4,
      width: width * 0.85,
      maxWidth: 320,
      height: height * 0.6,
      alignSelf: "center",
    },
    dateHeader: {
      height: 100,
      width: "100%",
      backgroundColor: "#ff5050ff",
      padding: 16,
      borderTopEndRadius: 10,
      borderTopLeftRadius: 10,
    },
    yearText: {
      color: "white",
      fontSize: 30,
    },
    dateText: {
      color: "white",
      fontSize: 24,
    },
    header: {
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    monthText: {
      fontSize: 18,
     fontWeight:"bold",
     color: "#FFF"
    },
    weekRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingHorizontal: 10,
      marginBottom: 5,
    },
    weekDay: {
      fontSize: 10,
      fontWeight: "600",
      color: "#AAA",
      width: 30,
      textAlign: "center",
    },
    grid: {
      paddingHorizontal: 10,
    },
    dayCell: {
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      margin: 2,
      borderRadius: 20,
    },
    dayText: {
      fontSize: 10,
      textAlign: "center",
      color: "#FFF"
    },
    disabled: {
      color: "#666",
    },
    today: {
      borderWidth: 1,
      borderColor: "#ff5050ff",
      borderRadius: 20,
      padding: 5,
    },
    selected: {
      backgroundColor: "#ff5050ff",
      borderRadius: 20,
      padding: 5,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      padding: 16,
      gap: 40,
      marginRight: 20,
    },
    buttonText: {
      color: "#ff5050ff",
      fontSize: 16,
      fontWeight:"700"
    },
    yearPicker: {
      marginVertical: 23,
      maxHeight: 280,
    },
    // New styles for better year selection UX
    yearPressable: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginVertical: 2,
      borderRadius: 8,
    },
    selectedYearPressable: {
      backgroundColor: "#ff5050ff",
    },
    disabledPressable: {
      opacity: 0.5,
    },
    yearItemText: {
      textAlign: "center",
      fontSize: 18,
      color: "#FFF",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      
      <View style={styles.modalContainer}>
        <Pressable 
          style={StyleSheet.absoluteFill} 
          onPress={onCancel}
        />
        <View style={styles.container}>
          <View style={styles.dateHeader}>
            <Pressable onPress={() => setShowYearPicker(true)}>
              <Text style={styles.yearText}>{selectedDate.getFullYear()}</Text>
            </Pressable>
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "short",
                day: "2-digit",
                month: "short",
              })}
            </Text>
          </View>

          {showYearPicker ? (
            <ScrollView style={styles.yearPicker}>
              {years.map((year) => {
                const isSelected = year === selectedDate.getFullYear();
                const isDisabled = restrictFutureDates && year > today.getFullYear();
                return (
                  <Pressable
                    key={year}
                    onPress={() => handleYearSelect(year)}
                    disabled={isDisabled}
                    style={[
                      styles.yearPressable,
                      isSelected && styles.selectedYearPressable,
                      isDisabled && styles.disabledPressable,
                    ]}
                  >
                    <Text style={styles.yearItemText}>{year}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <>
              <View style={styles.header}>
                <Pressable onPress={handlePrevMonth}>
                  <Ionicons name="chevron-back" size={24} color="#FFF" />
                </Pressable>
                <Text style={styles.monthText}>
                  {new Date(currentYear, currentMonth).toLocaleString(
                    "default",
                    {
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </Text>
                <Pressable onPress={handleNextMonth}>
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={
                      restrictFutureDates &&
                      currentYear >= today.getFullYear() &&
                      currentMonth >= today.getMonth()
                        ? "#666"
                        : "#FFF"
                    }
                  />
                </Pressable>
              </View>

              <View style={styles.weekRow}>
                {weekDays.map((day) => (
                  <Text key={day} style={styles.weekDay}>
                    {day}
                  </Text>
                ))}
              </View>

              <View style={styles.grid}>
                {Array.from({ length: days.length / 7 }, (_, rowIndex) => (
                  <View key={rowIndex} style={styles.weekRow}>
                    {days
                      .slice(rowIndex * 7, rowIndex * 7 + 7)
                      .map((day, colIndex) => (
                        <Pressable
                          key={colIndex}
                          style={[
                            styles.dayCell,
                            today.getDate() === day &&
                            today.getMonth() === currentMonth &&
                            today.getFullYear() === currentYear
                              ? styles.today
                              : null,
                            selectedDate.getDate() === day &&
                            selectedDate.getMonth() === currentMonth &&
                            selectedDate.getFullYear() === currentYear
                              ? styles.selected
                              : null,
                          ]}
                          onPress={() =>
                            day &&
                            !isDateDisabled(currentYear, currentMonth, day) &&
                            setSelectedDate(
                              new Date(currentYear, currentMonth, day)
                            )
                          }
                          disabled={isDateDisabled(currentYear, currentMonth, day)}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              day === null ||
                              isDateDisabled(currentYear, currentMonth, day)
                                ? styles.disabled
                                : null,
                              selectedDate.getDate() === day &&
                              selectedDate.getMonth() === currentMonth &&
                              selectedDate.getFullYear() === currentYear && {
                                color: "white",
                              },
                            ]}
                          >
                            {day || ""}
                          </Text>
                        </Pressable>
                      ))}
                  </View>
                ))}
              </View>
            </>
          )}

          <View
            style={[
              styles.buttonRow,
              { position: "absolute", bottom: 0, left: 0, right: 0 },
            ]}
          >
            <Pressable onPress={onCancel}>
              <Text style={styles.buttonText}>CANCEL</Text>
            </Pressable>
            <Pressable onPress={() => onConfirm(selectedDate)}>
              <Text style={styles.buttonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </View>
    
    </Modal>
  );
};

export default Calendar;