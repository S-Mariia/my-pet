import { supabase } from "@/supabase/supabase-client";
import { PetData } from "@/types/petData";

class PetService {
  async getPetsList(userId: string): Promise<PetData[]> {
    try {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("owner_id", userId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error fetching pets list:", err);
      return [];
    }
  }

  async getPetById(pet_id: string): Promise<PetData | null> {
    try {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("pet_id", pet_id)
        .single();

      if (error) throw error;
      return data || null;
    } catch (err) {
      console.error("Error fetching pet by id:", err);
      return null;
    }
  }

  createPet = async (petData: Omit<PetData, "pet_id">) => {
    const { data, error } = await supabase
      .from("pets")
      .insert([petData])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  async updatePet(pet_id: string, payload: Partial<PetData>) {
    try {
      const { data, error } = await supabase
        .from("pets")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("pet_id", pet_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating pet:", err);
      throw err;
    }
  }

  async deletePet(pet_id: string) {
    const { error } = await supabase.from("pets").delete().eq("pet_id", pet_id);

    if (error) throw error;
  }
}

export const petService = new PetService();
