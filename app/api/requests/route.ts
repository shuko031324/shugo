import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      client_name,
      email,
      facebook_name,
      mobile_number,
      service_id,
      custom_request,
      project_details,
      budget_range,
    } = body

    // Validation
    if (!client_name?.trim()) {
      return NextResponse.json(
        { error: 'Client name is required' },
        { status: 400 }
      )
    }

    if (!email && !facebook_name && !mobile_number) {
      return NextResponse.json(
        { error: 'At least one contact method is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get service details if service_id is provided
    let serviceName = null
    if (service_id) {
      const { data: service } = await supabase
        .from('services')
        .select('name')
        .eq('id', service_id)
        .single()
      serviceName = service?.name
    }

    // Insert the request
    const { data, error } = await supabase
      .from('project_requests')
      .insert({
        client_name,
        email: email || null,
        facebook_name: facebook_name || null,
        mobile_number: mobile_number || null,
        service_id: service_id || null,
        custom_request: custom_request || null,
        project_details: project_details || null,
        budget_range: budget_range || null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create request' },
        { status: 500 }
      )
    }

    // Send email notification
    if (resend && process.env.ADMIN_EMAIL) {
      try {
        const contactInfo = [
          email && `Email: ${email}`,
          facebook_name && `Facebook: ${facebook_name}`,
          mobile_number && `Mobile: ${mobile_number}`,
        ].filter(Boolean).join('\n')

        await resend.emails.send({
          from: 'SHUGO <onboarding@resend.dev>',
          to: process.env.ADMIN_EMAIL,
          subject: `New Project Request from ${client_name}`,
          html: `
            <div style="font-family: monospace; padding: 20px; background: #1a1625; color: #e0e0ff;">
              <h1 style="color: #ff6b9d; border-bottom: 2px solid #ff6b9d; padding-bottom: 10px;">
                NEW PROJECT REQUEST
              </h1>
              
              <div style="margin: 20px 0; padding: 15px; background: #252035; border: 2px solid #3d3555;">
                <h2 style="color: #00d4ff; margin-bottom: 10px;">Client Information</h2>
                <p><strong>Name:</strong> ${client_name}</p>
                <p><strong>Contact:</strong></p>
                <pre style="color: #a0a0ff;">${contactInfo}</pre>
              </div>
              
              <div style="margin: 20px 0; padding: 15px; background: #252035; border: 2px solid #3d3555;">
                <h2 style="color: #00d4ff; margin-bottom: 10px;">Project Details</h2>
                <p><strong>Service:</strong> ${serviceName || 'Not specified'}</p>
                <p><strong>Custom Request:</strong> ${custom_request || 'None'}</p>
                <p><strong>Budget Range:</strong> ${budget_range || 'Not specified'}</p>
                <p><strong>Details:</strong></p>
                <pre style="color: #a0a0ff; white-space: pre-wrap;">${project_details || 'No additional details provided'}</pre>
              </div>
              
              <p style="color: #888; font-size: 12px; margin-top: 30px;">
                Log in to your admin dashboard to respond to this request.
              </p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
