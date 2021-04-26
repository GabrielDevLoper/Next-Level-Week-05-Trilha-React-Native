import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";

export interface Plants {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: [string];
  frequency: {
    times: number;
    repeat_every: string;
  };
  dateTimeNotification: Date;
}

export interface StoragePlant {
  [id: string]: {
    data: Plants;
  };
}

export async function plantSave(plant: Plants): Promise<void> {
  try {
    const data = await AsyncStorage.getItem("@plantmanager:plants");
    const oldPlants = data ? (JSON.parse(data) as StoragePlant) : {};

    const newPlant = {
      [plant.id]: {
        data: plant,
      },
    };

    await AsyncStorage.setItem(
      "@plantmanager:plants",
      JSON.stringify({ ...newPlant, ...oldPlants })
    );
  } catch (error) {
    throw new Error(error);
  }
}

export async function loadPlant(): Promise<Plants[]> {
  try {
    const data = await AsyncStorage.getItem("@plantmanager:plants");
    const plants = data ? (JSON.parse(data) as StoragePlant) : {};

    const plantsSorted = Object.keys(plants)
      .map((plant) => {
        return {
          ...plants[plant].data,
          hour: format(
            new Date(plants[plant].data.dateTimeNotification),
            "HH:mm"
          ),
        };
      })
      .sort((a, b) =>
        Math.floor(
          new Date(a.dateTimeNotification).getTime() / 1000 -
            Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
        )
      );

    return plantsSorted;
  } catch (error) {
    throw new Error(error);
  }
}

export async function removePlant(id: string): Promise<void> {
  const data = await AsyncStorage.getItem("@plantmanager:plants");
  const plants = data ? JSON.parse(data) : {};

  delete plants[id];

  await AsyncStorage.setItem("@plantmanager:plants", JSON.stringify(plants));
}
