import {
  ContainerHome,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { HandPalm, Play } from "phosphor-react";
import { v4 as uuidv4 } from "uuid";
import { createContext, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForms/NewCycleForms";
import { Countdown } from "./components/Countdown/Countdown";
import * as zod from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const FormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(1, "O intervalo precisa ser de no máximo 5 minutos")
    .max(60, "O intervalo precisa ser de no máximo 60 minutos"),
});
type NewCycleFormData = zod.infer<typeof FormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}
interface CyclesContextType {
  activeCycle: Cycle | undefined;
  activeCycleId?: string | null;
  amountSecondPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function Home() {
  const [amountSecondPassed, setAmountSecondPassed] = useState(0);
  const [cycles, SetCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(FormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  function markCurrentCycleAsFinished() {
    SetCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
  }

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = uuidv4();


    const newCycle: Cycle = {
      id,
      minutesAmount: data.minutesAmount,
      task: data.task,
      startDate: new Date(),
    };
    SetCycles((state) => [...state, newCycle]);
    setActiveCycleId(id);
    setAmountSecondPassed(0);
    reset();
  }

  function handleInterruptCycle() {
    SetCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
    setActiveCycleId(null);
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondPassed(seconds);
  }

  const task = watch("task");
  const isSubmitDisabled = !task.trim();

  return (
    <ContainerHome>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CyclesContext.Provider
          value={{
            activeCycle,
            markCurrentCycleAsFinished,
            amountSecondPassed,
            setSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>
        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </ContainerHome>
  );
}
