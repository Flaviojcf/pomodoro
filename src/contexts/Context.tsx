import { differenceInSeconds } from "date-fns";
import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from "../reducers/cycles/actions";
import { cyclesReducer } from "../reducers/cycles/reducers";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId?: string | null;
  amountSecondPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  interruptCurrentCycle: () => void;
  createNewCycle: (data: CreateCycleData) => void;
}

interface CycleContextProviderProps {
  children: ReactNode;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({ children }: CycleContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storedStateJson = localStorage.getItem(
        "@ignite-pomodoro:cycles-state-1.0.0"
      );

      if (storedStateJson) {
        return JSON.parse(storedStateJson);
      }
      return {
        cycles: [],
        activeCycleId: null,
      };
    }
  );

  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
  const [amountSecondPassed, setAmountSecondPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }
    return 0;
  });

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);
    localStorage.setItem("@ignite-pomodoro:cycles-state-1.0.0", stateJSON);
  }, [cyclesState]);

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction());
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondPassed(seconds);
  }

  function createNewCycle(data: CreateCycleData) {
    const id = uuidv4();
    const newCycle: Cycle = {
      id,
      minutesAmount: data.minutesAmount,
      task: data.task,
      startDate: new Date(),
    };
    dispatch(addNewCycleAction(newCycle));

    setAmountSecondPassed(0);
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        markCurrentCycleAsFinished,
        amountSecondPassed,
        setSecondsPassed,
        interruptCurrentCycle,
        createNewCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
