import { Text, TextProps } from './Themed';
import { rubikFontFamily } from '../constants/fonts';

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: rubikFontFamily.regular }]} />;
}
