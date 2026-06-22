
'use client'

import { FC } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Locale } from '@/dictionaries/dictionaty'
import Cookies from 'js-cookie'
type Props = {
    lang: Locale
}

const LanguageToggler: FC<Props> = ({ lang }) => {
    const pathName = usePathname()
    const search = useSearchParams();

    const toggleLanguage = () => {
        Cookies.set('lang', getInverseLocale(lang))
        window.location.reload();
    }

    const getInverseLocale = (incoming_locale: Locale) => {
        let redirect_locale: Locale = "bn"
        if (incoming_locale == "bn") {
            redirect_locale = "en"
        } else {
            redirect_locale = "bn"
        }
        return redirect_locale
    }

    const getLocaleName = (incoming_locale: Locale) => {
        if (incoming_locale == "bn") {
            return "বাংলা"
        } else {
            return "English"
        }
    }

    return (
        <div>
            <div
                onClick={toggleLanguage}
                className='rounded-md border px-3 py-2 text-white cursor-pointer'
            >
                {getLocaleName(getInverseLocale(lang))}
            </div>

        </div>
    )
}

export default LanguageToggler