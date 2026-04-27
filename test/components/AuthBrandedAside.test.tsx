import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AuthBrandedAside } from '@/components/common/AuthBrandedAside'
import { AUTH_BRANDING_COPY } from '@/const/auth-branding'

describe('AuthBrandedAside', () => {
  it('renders the shared marketing headline and pool brand name', () => {
    render(<AuthBrandedAside />)

    expect(
      screen.getByRole('heading', { name: AUTH_BRANDING_COPY.marketingHeading }),
    ).toBeVisible()
    expect(screen.getByText(AUTH_BRANDING_COPY.brandName)).toBeVisible()
  })

  it('exposes a privacy anchor that targets the in-page notice', () => {
    render(<AuthBrandedAside />)

    const privacy = screen.getByRole('link', { name: AUTH_BRANDING_COPY.privacy })
    expect(privacy).toHaveAttribute('href', '#privacy-notice')
    expect(document.getElementById('privacy-notice')).toBeTruthy()
  })
})
