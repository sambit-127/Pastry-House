
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

interface TimePickerProps {
  visible: boolean;
  initialTime?: Date | null;
  onConfirm: (time: Date) => void;
  onCancel: () => void;
}

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

const CustomTimePicker: React.FC<TimePickerProps> = ({
  visible,
  initialTime,
  onConfirm,
  onCancel,
}) => {
  const [selectedTime, setSelectedTime] = useState<Date>(
    initialTime || new Date()
  );
  
  const hoursScrollRef = useRef<ScrollView>(null);
  const minutesScrollRef = useRef<ScrollView>(null);
  const amPmScrollRef = useRef<ScrollView>(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
  const minutes = Array.from({ length: 60 }, (_, i) => i); // 0-59
  const amPmOptions = ["AM", "PM"];

  // Convert to 12-hour format for display
  const get12HourFormat = (hour: number) => {
    return hour % 12 || 12;
  };

  // Scroll to initial positions when modal becomes visible
  useEffect(() => {
    if (visible) {
      const currentHour = get12HourFormat(selectedTime.getHours());
      const currentMinute = selectedTime.getMinutes();
      const currentIsAM = selectedTime.getHours() < 12;
      
      // Scroll to current time with offset to center the item
      setTimeout(() => {
        const hourOffset = (currentHour - 1) * ITEM_HEIGHT;
        const minuteOffset = currentMinute * ITEM_HEIGHT;
        const amPmOffset = currentIsAM ? 0 : ITEM_HEIGHT;
        
        hoursScrollRef.current?.scrollTo({
          y: hourOffset,
          animated: false,
        });
        
        minutesScrollRef.current?.scrollTo({
          y: minuteOffset,
          animated: false,
        });
        
        amPmScrollRef.current?.scrollTo({
          y: amPmOffset,
          animated: false,
        });
      }, 100);
    }
  }, [visible]);

  const handleConfirm = () => {
    onConfirm(selectedTime);
  };

  const scrollToHour = (hour: number) => {
    const offset = (hour - 1) * ITEM_HEIGHT;
    hoursScrollRef.current?.scrollTo({
      y: offset,
      animated: true,
    });
  };

  const scrollToMinute = (minute: number) => {
    const offset = minute * ITEM_HEIGHT;
    minutesScrollRef.current?.scrollTo({
      y: offset,
      animated: true,
    });
  };

  const scrollToAmPm = (ampm: string) => {
    const offset = ampm === "AM" ? 0 : ITEM_HEIGHT;
    amPmScrollRef.current?.scrollTo({
      y: offset,
      animated: true,
    });
  };

  const handleHourSelect = (hour: number) => {
    const newTime = new Date(selectedTime);
    // Convert to 24-hour format
    const isAM = selectedTime.getHours() < 12;
    const hour24 = isAM 
      ? (hour === 12 ? 0 : hour)
      : (hour === 12 ? 12 : hour + 12);
    newTime.setHours(hour24);
    setSelectedTime(newTime);
    
    // Scroll to selected hour
    scrollToHour(hour);
  };

  const handleMinuteSelect = (minute: number) => {
    const newTime = new Date(selectedTime);
    newTime.setMinutes(minute);
    setSelectedTime(newTime);
    
    // Scroll to selected minute
    scrollToMinute(minute);
  };

  const handleAmPmSelect = (ampm: string) => {
    const newTime = new Date(selectedTime);
    const currentHour = newTime.getHours();
    let newHour = currentHour;
    
    if (ampm === "AM" && currentHour >= 12) {
      newHour = currentHour - 12;
    } else if (ampm === "PM" && currentHour < 12) {
      newHour = currentHour + 12;
    }
    
    newTime.setHours(newHour);
    setSelectedTime(newTime);
    
    // Scroll to selected AM/PM
    scrollToAmPm(ampm);
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>, type: 'hour' | 'minute' | 'ampm') => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    
    if (type === 'hour') {
      const hour = hours[Math.min(Math.max(index, 0), hours.length - 1)];
      handleHourSelect(hour);
    } else if (type === 'minute') {
      const minute = minutes[Math.min(Math.max(index, 0), minutes.length - 1)];
      handleMinuteSelect(minute);
    } else if (type === 'ampm') {
      const ampmIndex = Math.min(Math.max(index, 0), amPmOptions.length - 1);
      const ampm = amPmOptions[ampmIndex];
      handleAmPmSelect(ampm);
    }
  };

  const getCurrent12Hour = () => {
    return get12HourFormat(selectedTime.getHours());
  };

  const getCurrentMinute = () => {
    return selectedTime.getMinutes();
  };

  const getCurrentAmPm = () => {
    return selectedTime.getHours() < 12 ? "AM" : "PM";
  };

  return (
    <Modal
      visible={visible}
      statusBarTranslucent
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Time</Text>
          </View>

          <View style={styles.timeContainer}>
            {/* Selection highlight line */}
            <View style={styles.selectionHighlight} />
            
            {/* Hours */}
            <View style={styles.columnContainer}>
              <View style={styles.scrollContainer}>
                <ScrollView 
                  ref={hoursScrollRef}
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={(e) => handleScrollEnd(e, 'hour')}
                >
                  {hours.map((hour) => (
                    <Pressable
                      key={hour}
                      style={styles.timeItem}
                      onPress={() => handleHourSelect(hour)}
                    >
                      <Text
                        style={[
                          styles.timeText,
                          getCurrent12Hour() === hour && styles.selectedTimeText,
                        ]}
                      >
                        {hour.toString().padStart(2, "0")}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <View style={styles.scrollFade} />
              </View>
              <Text style={styles.columnLabel}>HOURS</Text>
            </View>

            <Text style={styles.separator}>:</Text>

            {/* Minutes */}
            <View style={styles.columnContainer}>
              <View style={styles.scrollContainer}>
                <ScrollView 
                  ref={minutesScrollRef}
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={(e) => handleScrollEnd(e, 'minute')}
                >
                  {minutes.map((minute) => (
                    <Pressable
                      key={minute}
                      style={styles.timeItem}
                      onPress={() => handleMinuteSelect(minute)}
                    >
                      <Text
                        style={[
                          styles.timeText,
                          getCurrentMinute() === minute && styles.selectedTimeText,
                        ]}
                      >
                        {minute.toString().padStart(2, "0")}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <View style={styles.scrollFade} />
              </View>
              <Text style={styles.columnLabel}>MINUTES</Text>
            </View>

            {/* AM/PM */}
            <View style={styles.columnContainer}>
              <View style={styles.scrollContainer}>
                <ScrollView 
                  ref={amPmScrollRef}
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={(e) => handleScrollEnd(e, 'ampm')}
                >
                  {amPmOptions.map((ampm) => (
                    <Pressable
                      key={ampm}
                      style={styles.timeItem}
                      onPress={() => handleAmPmSelect(ampm)}
                    >
                      <Text
                        style={[
                          styles.timeText,
                          getCurrentAmPm() === ampm && styles.selectedTimeText,
                        ]}
                      >
                        {ampm}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <View style={styles.scrollFade} />
              </View>
              <Text style={styles.columnLabel}>AM/PM</Text>
            </View>
          </View>

          <View style={styles.selectedTimeDisplay}>
            <Text style={styles.selectedTimeTextDisplay}>
              {getCurrent12Hour().toString().padStart(2, "0")}:
              {getCurrentMinute().toString().padStart(2, "0")} {getCurrentAmPm()}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <Pressable 
              onPress={onCancel} 
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>CANCEL</Text>
            </Pressable>
            <Pressable 
              onPress={handleConfirm} 
              style={[styles.button, styles.confirmButton]}
            >
              <Text style={[styles.buttonText, styles.confirmButtonText]}>OK</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    
  },
  container: {
    backgroundColor: "#0a0909ff",
    borderRadius: 20,
    width: width * 0.85,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
     borderWidth: 1,
    borderColor: "#333",
  },
  header: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#ff5050ff",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: ITEM_HEIGHT * 3, // Show 3 items at a time
    marginBottom: 20,
    position: 'relative',
  },
  selectionHighlight: {
    position: 'absolute',
    top: '43%',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    marginTop: -ITEM_HEIGHT / 2,
    backgroundColor: 'rgba(115, 53, 60, 0.1)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ff5050ff",
    justifyContent:"center",
    alignItems:"center",
    zIndex: 1,
  },
  columnContainer: {
    alignItems: "center",
    flex: 1,
    zIndex: 2,
  },
  scrollContainer: {
    height: ITEM_HEIGHT * 3, // Show 3 items at a time
    width: '100%',
    position: 'relative',
  },
  scrollView: {
    height: ITEM_HEIGHT * 3,
    width: "100%",
    zIndex: 2,
  },
  scrollContent: {
    paddingVertical: ITEM_HEIGHT, // Add padding to center items
  },
  scrollFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 3,
    pointerEvents: 'none',
    // backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  timeItem: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 18,
    color: "#e0e0e0",
  },
  selectedTimeText: {
    color: "#ff5050ff",
    fontWeight: "700",
    fontSize: 20,
    
  },
  separator: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ff5050ff",
    marginHorizontal: 5,
    marginTop:-20,
    zIndex: 2,
  },
  columnLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#b0b0b0",
    marginTop: 5,
    textAlign: "center",
  },
  selectedTimeDisplay: {
    alignItems: "center",
    marginVertical: 15,
    padding: 15,
    backgroundColor: "#1a1a1a",
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: "#ff5050ff",
    shadowColor: "#ff5050ff",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedTimeTextDisplay: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: "#1a1a1a",
    borderWidth: 0.5,
    borderColor: "#ff5050ff",
  },
  confirmButton: {
    backgroundColor: "#ff5050ff",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButtonText: {
    color: "white",
  },
  confirmButtonText: {
    color: "white",
  },
});

export default CustomTimePicker;