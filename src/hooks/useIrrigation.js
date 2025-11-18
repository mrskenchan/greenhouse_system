import { useGreenhouse } from './useGreenhouse';

export const useIrrigation = () => {
 const { irrigationEvents, startIrrigation } = useGreenhouse();
 
 const isRiegoRunning = irrigationEvents.some(e => e.status === 'running');

 return { isRiegoRunning, startIrrigation, events: irrigationEvents };
};