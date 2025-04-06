import useHeaderOptions from "@/hooks/useHeaderOptions";
import { Stack } from "expo-router";
const HomeRoutesLayout = () => {
  const headerOptions = useHeaderOptions();
  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen name='index' />
    </Stack>
  );
};
export default HomeRoutesLayout;
