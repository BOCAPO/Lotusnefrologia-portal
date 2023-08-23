import { Fonts } from 'configs/Fonts_default';

type Props = {
  text: string;
  sizeFont: number;
  lineHeight: number;
  bold: boolean;
  color: string;
  style?: object | null;
  className?: string | undefined;
  callback?: () => void;
};

function Text({
  text,
  sizeFont,
  lineHeight,
  bold,
  color,
  className = undefined,
  style = null
}: Props): JSX.Element {
  return (
    <p
      className={className}
      style={{
        fontSize: sizeFont,
        lineHeight: lineHeight,
        color: color,
        fontFamily: Fonts.primary.regular,
        fontWeight: bold ? '700' : '300',
        ...style
      }}
    >
      {text}
    </p>
  );
}

type PropsVariation = {
  text: string;
  bold: boolean;
  color: string;
  style?: object | null;
  className?: string | undefined;
};

export function SmallText(props: PropsVariation) {
  return (
    <Text
      sizeFont={8}
      lineHeight={10}
      bold={props.bold}
      text={props.text}
      color={props.color}
      style={props.style}
      className={props.className}
    />
  );
}

export function SmallText2(props: PropsVariation) {
  return (
    <Text
      sizeFont={10}
      lineHeight={10}
      bold={props.bold}
      text={props.text}
      color={props.color}
      style={props.style}
      className={props.className}
    />
  );
}

export function LitteText(props: PropsVariation) {
  return (
    <Text
      sizeFont={12}
      lineHeight={14}
      bold={props.bold}
      text={props.text}
      color={props.color}
      style={props.style}
      className={props.className}
    />
  );
}

export function SmallMediumText(props: PropsVariation) {
  return (
    <Text
      sizeFont={14}
      lineHeight={16}
      bold={props.bold}
      text={props.text}
      color={props.color}
      className={props.className}
      style={props.style}
    />
  );
}

export function MediumText(props: PropsVariation) {
  return (
    <Text
      sizeFont={16}
      lineHeight={18}
      bold={props.bold}
      text={props.text}
      color={props.color}
      className={props.className}
      style={props.style}
    />
  );
}

export function MediumText2(props: PropsVariation) {
  return (
    <Text
      sizeFont={18}
      lineHeight={18}
      bold={props.bold}
      text={props.text}
      color={props.color}
      className={props.className}
      style={props.style}
    />
  );
}

export function MediumLargeText(props: PropsVariation) {
  return (
    <Text
      sizeFont={25}
      lineHeight={5}
      bold={props.bold}
      text={props.text}
      color={props.color}
      className={props.className}
      style={props.style}
    />
  );
}

export function LargeText(props: PropsVariation) {
  return (
    <Text
      sizeFont={30}
      lineHeight={10}
      bold={props.bold}
      text={props.text}
      color={props.color}
      className={props.className}
      style={props.style}
    />
  );
}

export function GiantBigText(props: PropsVariation) {
  return (
    <Text
      sizeFont={40}
      lineHeight={30}
      bold={props.bold}
      text={props.text}
      color={props.color}
      className={props.className}
      style={props.style}
    />
  );
}

// type PropsSkeleton = PropsWithChildren<{
//     width: number,
//     style?: object | null
// }>

// export function TextSkeleton({ width, style }: PropsSkeleton) {
//     return (
//         <Skeleton
//             style={{ ...style }}
//             width={Dimens.proportionalHeight(width)}
//             height={19}
//         />
//     )
// }
