import { Text, TextInput, TextStyle, StyleProp } from 'react-native';

type TextWithDefaults = typeof Text & {
  defaultProps?: {
    style?: StyleProp<TextStyle>;
  };
};

type TextInputWithDefaults = typeof TextInput & {
  defaultProps?: {
    style?: StyleProp<TextStyle>;
  };
};

export const rubikFontFamily = {
  regular: 'Rubik-Regular',
  medium: 'Rubik-Medium',
  semiBold: 'Rubik-SemiBold',
  bold: 'Rubik-Bold',
  extraBold: 'Rubik-ExtraBold',
  italic: 'Rubik-Italic',
} as const;

let rubikDefaultsApplied = false;

export const applyRubikFontDefaults = () => {
  if (rubikDefaultsApplied) {
    return;
  }

  const baseStyle = { fontFamily: rubikFontFamily.regular };

  const TextComponent = Text as TextWithDefaults;
  TextComponent.defaultProps = TextComponent.defaultProps ?? {};
  TextComponent.defaultProps.style = [
    TextComponent.defaultProps.style as StyleProp<TextStyle>,
    baseStyle,
  ];

  const TextInputComponent = TextInput as TextInputWithDefaults;
  TextInputComponent.defaultProps = TextInputComponent.defaultProps ?? {};
  TextInputComponent.defaultProps.style = [
    TextInputComponent.defaultProps.style as StyleProp<TextStyle>,
    baseStyle,
  ];

  rubikDefaultsApplied = true;
};

export const getRubikFontForWeight = (weight?: TextStyle['fontWeight']) => {
  switch (weight) {
    case '500':
      return rubikFontFamily.medium;
    case '600':
      return rubikFontFamily.semiBold;
    case '700':
    case 'bold':
      return rubikFontFamily.bold;
    case '800':
      return rubikFontFamily.extraBold;
    default:
      return rubikFontFamily.regular;
  }
};
