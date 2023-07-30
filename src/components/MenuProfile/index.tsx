import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { SmallMediumText } from 'components/Text';

import styles from './menuprofile.module.css';

import { Colors } from 'configs/Colors_default';
import { useAuth } from 'hooks/useAuth';
import { menusProfile } from 'utils/menus';

type Props = {
  style?: React.CSSProperties;
  id?: string;
};

export default function MenuProfile({ style, id }: Props) {
  const { signOut } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    const response = await signOut();
    if (response) {
      router.push('/');
    }
  }

  return (
    <div className={styles.menuProfile} style={style} id={id}>
      {menusProfile?.map((menu, index) => (
        <Link key={index} href={menu.link !== null ? menu.link : ''}>
          <div className={styles.menuProfileItem}>
            <SmallMediumText
              text={menu.title !== null ? menu.title : ''}
              bold={false}
              style={{ lineHeight: 2, margin: 0 }}
              color={Colors.greenDark}
            />
          </div>
        </Link>
      ))}
      <button
        onClick={() => {
          handleLogout();
        }}
      >
        <SmallMediumText
          text="Sair"
          bold={false}
          style={{ lineHeight: 2, margin: 0 }}
          color={Colors.greenDark}
        />
      </button>
    </div>
  );
}
