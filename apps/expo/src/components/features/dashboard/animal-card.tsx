import React from "react";
import { Pressable, View } from "react-native";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation, useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
  Button,
  ButtonText,
  Center,
  CloseIcon,
  Heading,
  Icon,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@gluestack-ui/themed";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import type { RouterOutputs } from "@acme/api";

import Text from "~/components/ui/text";
import { chatUrlForAnimal, navigateToChat } from "~/utils/chat";
import { downloadPresignedUrl } from "~/utils/helpers/images";

interface AnimalCardProps {
  animal: RouterOutputs["profile"]["animals"][number];
  onEdit: () => void;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onEdit }) => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [showAwarenessModal, setShowAwarenessModal] = React.useState(false);

  if (!animal) {
    return null;
  }

  const [imageUrl, setImageUrl] = React.useState(null);

  React.useEffect(() => {
    const fetchImageUrl = async () => {
      if (animal.avatarUrl) {
        const url = await downloadPresignedUrl(
          supabase,
          animal.avatarUrl,
          "animal-profiles",
        );
        setImageUrl(url);
      }
    };

    fetchImageUrl();
  }, [animal.avatarUrl, supabase]);

  return (
    <View className="w-94">
      <View className="relative mr-2 h-64 w-96 items-center rounded-xl border border-gray-300 bg-gray-200">
        <View className="absolute right-0 top-0 z-10 mx-4 mt-2 rounded-full">
          <Pressable
            onPress={() => setShowAwarenessModal(true)}
            className="overflow-hidden rounded-full border border-slate-700 shadow-lg"
          >
            <BlurView
              intensity={400}
              style={{
                padding: 4,
                borderRadius: 1000,
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
              }}
            >
              <Text className="mr-1 leading-none text-slate-800">
                Awareness: Low
              </Text>
            </BlurView>
          </Pressable>
        </View>
        <Image
          source={{ uri: imageUrl || undefined }}
          style={{ width: "100%", height: "100%", borderRadius: 10 }}
        />
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0.1, y: 1 }}
          colors={["black", "transparent"]}
          style={{
            width: "100%",
            height: "45%",
            position: "absolute",
            borderRadius: 10,
          }}
        />
        <View className="absolute w-full px-4 pt-2">
          <Text className="font-medium text-white">{animal.name}</Text>
          {/* <Text className="text-xs text-white">{animal.species}</Text> */}
        </View>
        <View className="absolute bottom-0 w-full px-2 pb-2">
          <AnimalCardButtons animalId={animal.id} />
        </View>
      </View>
      {showAwarenessModal && (
        <AnimalAwarenessModal
          isVisible={showAwarenessModal}
          onClose={() => setShowAwarenessModal(false)}
          animal={animal}
        />
      )}
    </View>
  );
};

export default AnimalCard;

const AnimalCardButtons: React.FC<{ animalId: string }> = ({ animalId }) => {
  const router = useRouter();
  return (
    <View className="w-full flex-row items-center justify-between">
      <Pressable
        onPress={() => navigateToChat(router, animalId)}
        className="mr-1 flex w-1/2 flex-row items-center justify-center rounded-xl border border-gray-400 bg-gray-50 p-2.5 shadow-sm"
      >
        <AntDesign name="message1" size={16} color="black" />
        <Text className="pl-2 text-center font-medium text-slate-900">
          Chat
        </Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("Profile")}
        className="mr-1 flex w-1/2 flex-row items-center justify-center rounded-xl border border-gray-400 bg-gray-50 p-2.5 shadow-sm"
      >
        <Ionicons name="paw" size={16} color="black" />
        <Text className="pl-2 text-center font-medium text-slate-900">
          Profile
        </Text>
      </Pressable>
    </View>
  );
};

const AnimalAwarenessModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  animal: RouterOutputs["profile"]["animals"][number];
}> = ({ isVisible, onClose, animal }) => {
  const ref = React.useRef(null);
  const router = useRouter();

  return (
    <Center h={300}>
      <Modal
        isOpen={isVisible}
        onClose={() => {
          onClose();
        }}
        finalFocusRef={ref}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Explaining the awareness indicator</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text>
              This indicator is scored based on how much information Vettee has
              gathered about {animal.name}. The more information we have, the
              higher the awareness score. You can help us increase the awareness
              score by chatting with Vettee about {animal.name}.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              size="sm"
              action="secondary"
              mr="$3"
              onPress={() => {
                onClose();
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              size="sm"
              action="positive"
              borderWidth="$0"
              onPress={() => {
                navigateToChat(router, animal.id);
                onClose();
              }}
            >
              <ButtonText>Chat about {animal.name}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
};
